import { Container, Grid } from '@/design-system/layout'
import React from 'react'
import wipSvg from './undraw_qa_engineers_dg-5-p.svg'

export default function BetaBanner({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<Container
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.bases.secondary[700]
					: theme.colors.bases.tertiary[100]
			}
		>
			<Grid
				container
				spacing={4}
				css={`
					align-items: center;
				`}
			>
				<Grid item sm={3}>
					<img
						src={wipSvg}
						alt=""
						style={{ width: '100%', padding: '0.25rem' }}
					/>
				</Grid>
				<Grid item sm={9}>
					{children}
				</Grid>
			</Grid>
		</Container>
	)
}
