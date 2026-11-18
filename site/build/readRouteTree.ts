import { existsSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { englishPathFrom, RouteDirectory } from './translatedPaths'

const requireDeclaration = createRequire(__filename)

export const readRouteTree = (dir: string): RouteDirectory[] =>
	readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const subDir = join(dir, entry.name)
			const declaration = join(subDir, 'path.ts')

			return {
				name: entry.name,
				englishPath: existsSync(declaration)
					? englishPathFrom(requireDeclaration(declaration), declaration)
					: undefined,
				servesAPage: existsSync(join(subDir, 'page.tsx')),
				children: readRouteTree(subDir),
			}
		})
