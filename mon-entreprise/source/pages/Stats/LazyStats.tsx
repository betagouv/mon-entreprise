import { lazy, Suspense } from 'react'
const Stats = lazy(() => import('./Stats'))

export default function LazyStats() {
	return (
		<Suspense
			fallback={<p className="ui__ lead">Chargement des statistiques...</p>}
		>
			<Stats />
		</Suspense>
	)
}
