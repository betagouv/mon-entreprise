import styled, { css } from 'styled-components'
import { SpacingKey } from '../theme'
import { Grid as OldGrid } from '@mui/material'
import { useContext, createContext } from 'react'

const TMP_FALLBACK_PREVIOUS_GRID = false

const breakPoints = ['sm', 'md', 'lg', 'xl'] as Array<SpacingKey>

type ContainerContext = {
	nbColumns: number
}

const GridContainerContext = createContext<ContainerContext>({
	nbColumns: 12,
})

type GridProps =
	| ({ item: true } & GridItemProps)
	| ({ container: true } & GridContainerProps)

export function Grid(props: GridProps) {
	if (TMP_FALLBACK_PREVIOUS_GRID) {
		return <OldGrid {...props} />
	}

	if (props.container) {
		return <GridContainer {...props} />
	} else if (props.item) {
		return <GridItem {...props} />
	}

	return null
}

const StyledGridContainer = styled.div<GridContainerProps>`
	display: grid;
	grid-template-columns: repeat(${(props) => props.columns ?? 12}, 1fr);
	/* flex-wrap: wrap;

	flex-direction: row; */

	gap: ${({ spacing }) => (spacing ?? 0) * 6}px;
`

const StyledGridItem = styled.div<GridItemProps>`
	${(props) => css`
		grid-column: span ${props.xs ?? props.nbColumns};
	`}

	${(props) =>
		breakPoints
			.filter((id) => props[id])
			.map(
				(id) => css`
					@media (min-width: ${({ theme }) => theme.breakpointsWidth[id]}) {
						grid-column: span ${props[id]};
					}
				`
			)}
`
type GridContainerProps = {
	columns?: number
	spacing?: number
	className?: string
	id?: string
	children: React.ReactNode
}

function GridContainer({
	columns = 12,
	spacing = 0,
	className,
	id,
	children,
}: GridContainerProps) {
	return (
		<GridContainerContext.Provider value={{ nbColumns: columns }}>
			<StyledGridContainer spacing={spacing} className={className} id={id}>
				{children}
			</StyledGridContainer>
		</GridContainerContext.Provider>
	)
}

type GridItemProps = {
	children?: React.ReactNode
	className?: string
} & Partial<Record<SpacingKey | 'xs', number>>

function GridItem({ xs, sm, md, lg, xl, className, children }: GridItemProps) {
	const containerContext = useContext(GridContainerContext)

	return (
		<StyledGridItem
			{...{ xs, sm, md, lg, xl, ...containerContext }}
			className={className}
		>
			{children}
		</StyledGridItem>
	)
}
