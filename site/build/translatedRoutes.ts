import type { RouteHrefs } from '@/services/routing'

export type Route = { original: string; translated: string }

export type RouteDirectory = {
	name: string
	translatedPath?: string
	servesAPage: boolean
	children: RouteDirectory[]
}

const ROUTE_GROUP = /^\(.*\)$/
const PARALLEL_SLOT = /^@/
const PRIVATE_FOLDER = /^_/
const INTERCEPTING_ROUTE = /^\(\.{1,3}\)/
const DYNAMIC_SEGMENT = /^\[(.+)\]$/
const CATCH_ALL_SEGMENT = /^\[\.\.\.(.+)\]$/
const OPTIONAL_CATCH_ALL_SEGMENT = /^\[\[\.\.\.(.+)\]\]$/

const isDynamicSegment = (name: string) => DYNAMIC_SEGMENT.test(name)

const isCatchAllSegment = (name: string) =>
	CATCH_ALL_SEGMENT.test(name) || OPTIONAL_CATCH_ALL_SEGMENT.test(name)

const definesNoUrlSegment = (name: string) =>
	ROUTE_GROUP.test(name) || PARALLEL_SLOT.test(name)

const isOutsideTheUrlSpace = (name: string) =>
	PRIVATE_FOLDER.test(name) || INTERCEPTING_ROUTE.test(name)

const asRoutePattern = (name: string): string => {
	const catchAll =
		OPTIONAL_CATCH_ALL_SEGMENT.exec(name) ?? CATCH_ALL_SEGMENT.exec(name)

	if (catchAll) {
		return `:${catchAll[1]}*`
	}

	const dynamic = DYNAMIC_SEGMENT.exec(name)

	return dynamic ? `:${dynamic[1]}` : name
}

const assertNoTranslationOnDynamicSegment = ({
	name,
	translatedPath,
}: RouteDirectory) => {
	if (isDynamicSegment(name) && translatedPath !== undefined) {
		throw new Error(
			`${name} is a dynamic segment and cannot declare a translated path`
		)
	}
}

const translatedSegmentOf = ({ name, translatedPath }: RouteDirectory) =>
	isDynamicSegment(name) ? asRoutePattern(name) : (translatedPath ?? name)

const appendSegment = (parent: Route, directory: RouteDirectory): Route =>
	definesNoUrlSegment(directory.name)
		? parent
		: {
				original: `${parent.original}/${asRoutePattern(directory.name)}`,
				translated: `${parent.translated}/${translatedSegmentOf(directory)}`,
			}

const ROOT = '/'

const withExplicitRoot = ({ original, translated }: Route): Route => ({
	original: original || ROOT,
	translated: translated || ROOT,
})

const hasATranslation = ({ original, translated }: Route) =>
	original !== translated

const SPECIFICITY = { static: 0, dynamic: 1, catchAll: 2 } as const

const specificityOf = (name: string): number =>
	isCatchAllSegment(name)
		? SPECIFICITY.catchAll
		: isDynamicSegment(name)
			? SPECIFICITY.dynamic
			: SPECIFICITY.static

const mostSpecificFirst = (a: RouteDirectory, b: RouteDirectory) =>
	specificityOf(a.name) - specificityOf(b.name)

export const pageRoutes = (
	directories: RouteDirectory[],
	parent: Route = { original: '', translated: '' }
): Route[] =>
	directories
		.filter((directory) => !isOutsideTheUrlSpace(directory.name))
		.sort(mostSpecificFirst)
		.flatMap((directory) => {
			assertNoTranslationOnDynamicSegment(directory)

			const route = appendSegment(parent, directory)

			return [
				...(directory.servesAPage ? [withExplicitRoot(route)] : []),
				...pageRoutes(directory.children, route),
			]
		})

export const translatedRoutes = (directories: RouteDirectory[]): Route[] =>
	pageRoutes(directories).filter(hasATranslation)

export const routeHrefs = (
	routes: Route[],
	servesTranslatedPaths: boolean
): RouteHrefs =>
	Object.fromEntries(
		routes.map(({ original, translated }) => [
			original,
			servesTranslatedPaths ? translated : original,
		])
	)
