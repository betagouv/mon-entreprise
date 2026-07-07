import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const sourceRoot = path.join(projectRoot, 'source')
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']
const ignoredDirs = new Set(['.git', '.next', 'node_modules', 'dist', 'build', 'coverage'])

function removeAccents(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
}

function walkFiles(root, collector) {
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        const fullPath = path.join(root, entry.name)
        if (entry.isDirectory()) {
            if (!ignoredDirs.has(entry.name)) {
                walkFiles(fullPath, collector)
            }
        } else if (entry.isFile()) {
            collector.push(fullPath)
        }
    }
}

function resolveSpecifier(specifier, importerFile) {
    if (!specifier || specifier.startsWith('http://') || specifier.startsWith('https://') || specifier.startsWith('data:')) {
        return null
    }

    let basePath = null
    if (specifier.startsWith('@/')) {
        basePath = path.join(sourceRoot, specifier.slice(2))
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
        basePath = path.resolve(path.dirname(importerFile), specifier)
    } else {
        return null
    }

    const normalized = removeAccents(specifier)
    const candidates = []
    for (const candidate of [
        basePath,
        path.resolve(path.dirname(importerFile), normalized),
        specifier.startsWith('@/') ? path.join(sourceRoot, removeAccents(specifier.slice(2))) : null,
    ]) {
        if (candidate) candidates.push(candidate)
    }

    for (const candidate of candidates) {
        for (const ext of extensions) {
            if (fs.existsSync(candidate + ext)) return candidate + ext
            if (fs.existsSync(path.join(candidate, 'index' + ext))) return path.join(candidate, 'index' + ext)
        }
        if (fs.existsSync(candidate)) return candidate
    }

    return null
}

function toImportSpecifier(resolvedPath, importerFile, originalSpecifier) {
    if (originalSpecifier.startsWith('@/')) {
        const rel = path.relative(sourceRoot, resolvedPath)
        const normalizedRel = rel.split(path.sep).join('/')
        const ext = path.extname(resolvedPath)
        if (ext) {
            return '@/' + normalizedRel.replace(new RegExp(`${ext.replace('.', '\\.')}$`), '')
        }
        return '@/' + normalizedRel
    }

    const rel = path.relative(path.dirname(importerFile), resolvedPath)
    const relPosix = rel.split(path.sep).join('/')
    const ext = path.extname(resolvedPath)
    const withoutExt = ext ? relPosix.replace(new RegExp(`${ext.replace('.', '\\.')}$`), '') : relPosix
    return withoutExt.startsWith('.') ? withoutExt : `./${withoutExt}`
}

function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')
    let updated = content

    const importPattern = /(from\s+|import\s*\(|require\s*\()(["'])([^"']+)(\2)/g
    updated = updated.replace(importPattern, (match, prefix, quote, specifier) => {
        const resolved = resolveSpecifier(specifier, filePath)
        if (!resolved) return match
        const newSpecifier = toImportSpecifier(resolved, filePath, specifier)
        return `${prefix}${quote}${newSpecifier}${quote}`
    })

    if (updated !== content) {
        fs.writeFileSync(filePath, updated)
        return true
    }
    return false
}

function main() {
    const files = []
    walkFiles(sourceRoot, files)
    let changed = 0
    for (const file of files) {
        const ext = path.extname(file).toLowerCase()
        if (!['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'].includes(ext)) continue
        if (updateFile(file)) changed += 1
    }
    console.log(`Updated imports in ${changed} file(s).`)
}

main()
