import { environnement } from '@/services/environnement'

import { parseRouteHrefs, type RouteHrefs } from './routeHrefs'

export const routeHrefs: RouteHrefs = environnement.sousVite
	? {}
	: parseRouteHrefs(process.env.ROUTE_HREFS)
