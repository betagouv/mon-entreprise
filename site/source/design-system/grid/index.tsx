import styled, { css } from 'styled-components'
import { SpacingKey } from '../theme'
import { Grid as OldGrid } from '@mui/material'
import { useContext, createContext } from 'react'

const TMP_FALLBACK_PREVIOUS_GRID = false

const breakPoints = ['sm', 'md', 'lg', 'xl'] as Array<SpacingKey>

type ContainerContext = {
	nbColumns: number
	spacing: number
}

const GridContainerContext = createContext<ContainerContext>({
	nbColumns: 12,
	spacing: 0,
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
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;

	gap: ${({ spacing }) => (spacing ?? 0) * 6}px;
`

const flexBasis = <Id extends SpacingKey | 'xs'>(
	id: Id,
	props: Record<Id, number> & ContainerContext
) => {
	const widthInNumberOfColumns = props[id]
	const proportion = widthInNumberOfColumns / props.nbColumns
	const nbColumns = Math.floor(1 / proportion)
	const spacingToDispatch = (props.spacing * 6 * (nbColumns - 1)) / nbColumns

	return `calc(
		${proportion * 100}% - ${spacingToDispatch}px
	)`
}

const StyledGridItem = styled.div<GridItemProps>`
	${(props) =>
		props.xs
			? css`
					flex-basis: ${flexBasis('xs', props)};
					flex-grow: 0;
			  `
			: css`
					flex-grow: 1;
			  `}

	${(props) =>
		breakPoints
			.filter((id) => props[id])
			.map(
				(id) => css`
					@media (min-width: ${({ theme }) => theme.breakpointsWidth[id]}) {
						flex-basis: ${flexBasis(id, props)};
						flex-grow: 0;
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
		<GridContainerContext.Provider value={{ nbColumns: columns, spacing }}>
			<StyledGridContainer spacing={spacing} className={className} id={id}>
				{children}
			</StyledGridContainer>
		</GridContainerContext.Provider>
	)
}

type GridItemProps = {
	children?: React.ReactNode
	xs?: number
	className?: string
} & Partial<Record<SpacingKey, number>>

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
