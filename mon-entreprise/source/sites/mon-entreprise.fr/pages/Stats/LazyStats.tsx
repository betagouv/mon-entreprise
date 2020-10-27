import { lazy, Suspense } from 'react'
const Stats = lazy(() => import('./Stats'))

export default function LazyStats() {
	return (
		<Suspense
			fallback={<p className="ui__ lead">Chargement de la page stats</p>}
		>
			<Stats />
		</Suspense>
	)
}
