import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'

import StatutsDisponibles from './StatutsDisponibles'

export default function Layout({
	title,
	children,
}: {
	title: React.ReactNode
	children?: React.ReactNode
}) {
	return (
		<>
			<Grid container spacing={5}>
				<Grid item sm={12} md={7} lg={8}>
					<H3 as="h2">{title}</H3>
					{children}
				</Grid>
				<Grid item sm={12} md={5} lg={4}>
					<StatutsDisponibles />
				</Grid>
			</Grid>
		</>
	)
}
