import { Grid } from '@/design-system/layout'
import { H1 } from '@/design-system/typography/heading'
import { ReactNode } from 'react'
import styled from 'styled-components'

const Illustration = styled.img<{ titre: ReactNode }>`
	height: 100%;
	width: 100%;
	vertical-align: bottom;
	padding-top: ${({ theme }) => theme.spacings.xl};
`

export default function PageHeader({
	titre,
	children,
	picture,
}: {
	titre?: ReactNode
	children?: ReactNode
	picture?: string
}) {
	return (
		<Grid
			container
			spacing={3}
			css={`
				align-items: center;
			`}
		>
			<Grid
				item
				sm={12}
				md={picture ? 9 : 12}
				lg={picture ? 8 : 12}
				css={`
					display: flex;
					flex-direction: column !important;
					align-items: flex-start;
				`}
			>
				{titre && <H1>{titre}</H1>}
				<div>{children}</div>
			</Grid>

			{picture && (
				<InnerGrid item className="hide-mobile" md={3} lg={4}>
					<Illustration
						className="hide-mobile"
						titre={titre}
						src={picture}
						alt=""
					/>
				</InnerGrid>
			)}
		</Grid>
	)
}

const InnerGrid = styled(Grid)`
	align-self: flex-end;
	z-index: -1;
	display: none;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.md}) {
		display: block;
	}
`
