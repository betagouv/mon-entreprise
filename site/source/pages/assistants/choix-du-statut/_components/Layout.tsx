import { Grid } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'

import StatutsDisponibles from './StatutsDisponibles'

export default function Layout({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<>
			<H1>{title}</H1>
			<Grid container spacing={5}>
				<Grid item sm={12} md={7} lg={8}>
					{children}
				</Grid>
				<Grid item sm={12} md={5} lg={4}>
					<StatutsDisponibles />
				</Grid>
			</Grid>
		</>
	)
}
