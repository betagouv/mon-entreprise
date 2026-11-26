import type { AvailableLang } from '@/locales/langue'

import routesRaw from './routes.yaml'

type DeclaredRoute = { path: string } & Record<AvailableLang, string>

const declaredRoutes = routesRaw as DeclaredRoute[]

export const declaredPaths = declaredRoutes.map(({ path }) => path)

export const routeLabels = (langue: AvailableLang): Record<string, string> =>
	Object.fromEntries(declaredRoutes.map((route) => [route.path, route[langue]]))
