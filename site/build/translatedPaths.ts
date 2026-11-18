export type TranslatedPath = { fr: string; en: string }

export type RouteDirectory = {
	name: string
	englishPath?: string
	servesAPage: boolean
	children: RouteDirectory[]
}

type PathDeclaration = { englishPath: string }

const isPathDeclaration = (
	declaration: unknown
): declaration is PathDeclaration =>
	typeof declaration === 'object' &&
	declaration !== null &&
	'englishPath' in declaration &&
	typeof declaration.englishPath === 'string' &&
	declaration.englishPath.length > 0

export const englishPathFrom = (declaration: unknown, file: string): string => {
	if (!isPathDeclaration(declaration)) {
		throw new Error(`${file} must export a non-empty englishPath string`)
	}

	return declaration.englishPath
}

const isRouteGroup = (name: string) => name.startsWith('(')

const isDynamicSegment = (name: string) => name.startsWith('[')

const asRoutePattern = (name: string): string => {
	const catchAll = /^\[\[?\.\.\.(.+?)\]?\]$/.exec(name)

	if (catchAll) {
		return `:${catchAll[1]}*`
	}

	const dynamic = /^\[(.+)\]$/.exec(name)

	return dynamic ? `:${dynamic[1]}` : name
}

const segmentsOf = (directory: RouteDirectory): TranslatedPath =>
	isRouteGroup(directory.name)
		? { fr: '', en: '' }
		: isDynamicSegment(directory.name)
			? {
					fr: asRoutePattern(directory.name),
					en: asRoutePattern(directory.name),
				}
			: {
					fr: directory.name,
					en: directory.englishPath ?? directory.name,
				}

export const translatedPaths = (
	directories: RouteDirectory[],
	current: TranslatedPath = { fr: '', en: '' }
): TranslatedPath[] =>
	[...directories]
		.sort(
			(a, b) =>
				Number(isDynamicSegment(a.name)) - Number(isDynamicSegment(b.name))
		)
		.flatMap((directory) => {
			const segment = segmentsOf(directory)
			const path = {
				fr: segment.fr ? `${current.fr}/${segment.fr}` : current.fr,
				en: segment.en ? `${current.en}/${segment.en}` : current.en,
			}

			return [
				...(directory.servesAPage && path.fr !== path.en ? [path] : []),
				...translatedPaths(directory.children, path),
			]
		})
