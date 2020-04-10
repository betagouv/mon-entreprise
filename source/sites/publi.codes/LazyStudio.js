import React, { Suspense } from 'react'
import { Header } from './Header'
let Studio = React.lazy(() => import('./Studio'))

export default function LazyStudio() {
	return (
		<div
			css={`
				display: flex;
				height: 100%;
				flex-direction: column;
			`}
		>
			<div className="ui__ container">
				<Header noSubtitle sectionName="Studio" />
			</div>
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
