import { existsSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { translatedPathFrom } from './pathDeclaration'
import { RouteDirectory } from './translatedRoutes'

export type TranslatedPathReader = (directory: string) => string | undefined

const fromPathDeclaration: TranslatedPathReader = (directory) => {
	const file = join(directory, 'path.ts')

	return existsSync(file)
		? translatedPathFrom(createRequire(file)(file), file)
		: undefined
}

export const readRouteTree = (
	dir: string,
	translatedPathOf: TranslatedPathReader = fromPathDeclaration
): RouteDirectory[] =>
	readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const subDir = join(dir, entry.name)

			return {
				name: entry.name,
				translatedPath: translatedPathOf(subDir),
				servesAPage: existsSync(join(subDir, 'page.tsx')),
				children: readRouteTree(subDir, translatedPathOf),
			}
		})
