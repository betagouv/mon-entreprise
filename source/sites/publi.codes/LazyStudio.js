import React, { Suspense } from 'react'
let Studio = React.lazy(() => import('./Studio'))

export default function LazyStudio() {
	return (
		<Suspense fallback={<div>Chargement du code source...</div>}>
			<Studio />
		</Suspense>
	)
}
