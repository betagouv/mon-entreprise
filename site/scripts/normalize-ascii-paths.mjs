import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const targetRoot = path.join(projectRoot, 'source')

const ignoredDirs = new Set(['.git', '.next', 'node_modules', 'dist', 'build', 'coverage'])

function hasNonAscii(value) {
    return /[^\u0000-\u007f]/.test(value)
}

function toAsciiName(value) {
    const normalized = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    const ascii = normalized.replace(/[^A-Za-z0-9._-]+/g, '')
    return ascii || '_'
}

function walkFiles(root, collector) {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (entry.name.startsWith('.') && entry.name !== '.well-known') continue
        const fullPath = path.join(root, entry.name)
        if (entry.isDirectory()) {
            if (!ignoredDirs.has(entry.name)) {
                collector.push(fullPath)
                walkFiles(fullPath, collector)
            }
        } else if (entry.isFile()) {
            collector.push(fullPath)
        }
    }
}

function renameEntries(root) {
    const renames = []
    const entries = []
    walkFiles(root, entries)
    entries.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length)

    for (const entryPath of entries) {
        const stats = fs.statSync(entryPath)
        const baseName = path.basename(entryPath)
        if (!hasNonAscii(baseName)) continue
        const parentDir = path.dirname(entryPath)
        const newBaseName = toAsciiName(baseName)
        let candidate = newBaseName
        let suffix = 1
        while (fs.existsSync(path.join(parentDir, candidate))) {
            candidate = `${newBaseName}-${suffix}`
            suffix += 1
        }
        const newPath = path.join(parentDir, candidate)
        fs.renameSync(entryPath, newPath)
        renames.push({ oldName: baseName, newName: candidate })
    }

    return renames
}

function updateReferences(projectRootPath, renames) {
    const filesToUpdate = []
    walkFiles(projectRootPath, filesToUpdate)

    for (const filePath of filesToUpdate) {
        let content = ''
        try {
            content = fs.readFileSync(filePath, 'utf8')
        } catch {
            continue
        }
        let updated = content
        for (const { oldName, newName } of renames) {
            updated = updated.replaceAll(oldName, newName)
        }
        if (updated !== content) {
            fs.writeFileSync(filePath, updated)
        }
    }
}

function main() {
    const renames = renameEntries(targetRoot)
    updateReferences(projectRoot, renames)
    console.log(`Renamed ${renames.length} path(s) to ASCII-safe names.`)
}

main()
