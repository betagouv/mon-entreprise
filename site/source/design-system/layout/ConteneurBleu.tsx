import { ReactNode } from 'react'

import Container from './Container'

interface ConteneurBleuProps {
	children: ReactNode
	style?: React.CSSProperties
	foncé?: boolean
}

export const ConteneurBleu = ({
	children,
	style,
	foncé = false,
}: ConteneurBleuProps) => {
	return (
		<Container
			backgroundColor={(theme) => {
				if (foncé) {
					return theme.darkMode
						? theme.colors.extended.dark[800]
						: theme.colors.bases.primary[700]
				}

				return theme.darkMode
					? theme.colors.extended.dark[700]
					: theme.colors.bases.primary[100]
			}}
			style={{
				padding: '1rem 0',
				...style,
			}}
		>
			{children}
		</Container>
	)
}
