import { lazy, Suspense } from 'react'
import { Header } from './Header'
const Studio = lazy(() => import('./Studio'))

export default function LazyStudio() {
	return (
		<div
			css={`
				display: flex;
				height: 100%;
				flex-direction: column;
			`}
		>
			<Suspense
				fallback={
					<p
						className="ui__ lead"
						css={`
							text-align: center;
							margin-top: 1rem;
						`}
					>
						Chargement du code source...
					</p>
				}
			>
				<Studio />
			</Suspense>
		</div>
	)
}
