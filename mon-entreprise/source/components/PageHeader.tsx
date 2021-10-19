import { ReactNode } from 'react'

export default function PageHeader({
	titre,
	children,
	picture,
}: {
	titre?: ReactNode
	children: ReactNode
	picture?: string
}) {
	return (
		<header css="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem; ">
			<div>
				{titre && <h1>{titre}</h1>}
				{children}
			</div>

			{picture && (
				<img
					className="ui__ hide-mobile"
					src={picture}
					alt={`${titre}`}
					css={`
						margin-left: 3rem;
						z-index: -1;
						max-width: 15rem;
						transform: translateX(2rem) ${titre && 'translateY(3.5rem)'}
							scale(1.4);
					`}
				/>
			)}
		</header>
	)
}
