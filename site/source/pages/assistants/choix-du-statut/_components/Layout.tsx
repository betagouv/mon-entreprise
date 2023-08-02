import { Grid } from '@/design-system/layout'
import { H3 } from '@/design-system/typography/heading'

import StatutsPossibles from './StatutsPossibles'

export default function Layout({
	title,
	children,
}: {
	title: React.ReactNode
	children?: React.ReactNode
}) {
	return (
		<>
			<Grid container spacing={4}>
				<Grid item xs={12} md={8} lg={8}>
					<H3 as="h2">{title}</H3>
					{children}
				</Grid>
				<Grid item xs={12} md={4} lg={4}>
					<StatutsPossibles />
				</Grid>
			</Grid>
		</>
	)
}
