/**
 * Convertit les fichiers YAML de traduction en JSON pour Next.js.
 *
 * Next.js (Turbopack) ne supporte pas l'import de fichiers YAML nativement.
 * Vite gère ça via @rollup/plugin-yaml. On contourne en générant des JSON
 * équivalents que Next.js peut importer statiquement.
 *
 * Usage CLI : `tsx scripts/i18n/yaml-to-json.ts`
 * Usage programmatique : `convertAllYamlToJson()` puis optionnellement
 * `startYamlWatcher()` (cf. instrumentation.ts).
 */
import { watch } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { parse as parseYaml } from 'yaml'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = path.resolve(SCRIPT_DIR, '../../source/locales')
const GENERATED_DIR = path.join(LOCALES_DIR, '.generated')

function isYaml(filename: string): boolean {
	return filename.endsWith('.yaml')
}

async function listYamlFiles(): Promise<string[]> {
	const entries = await fs.readdir(LOCALES_DIR)

	return entries.filter(isYaml)
}

async function convertFile(name: string): Promise<void> {
	const yamlContent = await fs.readFile(path.join(LOCALES_DIR, name), 'utf-8')
	const data = parseYaml(yamlContent) as unknown
	const jsonName = name.replace(/\.yaml$/, '.json')
	await fs.writeFile(
		path.join(GENERATED_DIR, jsonName),
		JSON.stringify(data, null, 2)
	)
}

export async function convertAllYamlToJson(): Promise<void> {
	await fs.mkdir(GENERATED_DIR, { recursive: true })
	const files = await listYamlFiles()
	await Promise.all(files.map(convertFile))
}

export function startYamlWatcher(): () => void {
	const watcher = watch(LOCALES_DIR)
	const debounceTimers = new Map<string, NodeJS.Timeout>()

	watcher.on('change', (_eventType, filename) => {
		const file = filename?.toString()
		if (!file || !isYaml(file)) return

		const existing = debounceTimers.get(file)
		if (existing) clearTimeout(existing)
		debounceTimers.set(
			file,
			setTimeout(() => {
				debounceTimers.delete(file)
				convertFile(file).catch((err) =>
					// eslint-disable-next-line no-console
					console.error(`[i18n] Erreur conversion ${file} :`, err)
				)
			}, 50)
		)
	})

	return () => {
		debounceTimers.forEach((timer) => clearTimeout(timer))
		debounceTimers.clear()
		watcher.close()
	}
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	convertAllYamlToJson().catch((err) => {
		// eslint-disable-next-line no-console
		console.error('[i18n] Conversion YAML→JSON échouée :', err)
		process.exit(1)
	})
}
