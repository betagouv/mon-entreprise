import styled, { css } from 'styled-components'
import { SpacingKey } from '../theme'
import { useContext, createContext } from 'react'

const breakPoints = ['sm', 'md', 'lg', 'xl'] as Array<SpacingKey>

type ContainerContext = {
	nbColumns: number
	spacing: number
}

const GridContainerContext = createContext<ContainerContext>({
	nbColumns: 12,
	spacing: 0,
})

const spacingValues = ['0rem', '0.5rem', '0.75rem', '1rem', '1.5rem']

type BreakpointConfig = number | true | 'auto' | undefined
const breakPointCss = (
	breakPointConfig: BreakpointConfig,
	nbColumns: number
) => {
	if (breakPointConfig === undefined) {
		return ''
	} else if (breakPointConfig === true) {
		return css`
			max-width: 100%;
			flex-basis: 0;
			flex-grow: 1;
		`
	} else if (breakPointConfig === 'auto') {
		return css`
			flex: 0 0 auto;
			width: auto;
		`
	} else {
		return css`
			flex-basis: ${(breakPointConfig / nbColumns) * 100}%;
			flex-grow: 0;
		`
	}
}

type GridProps =
	| ({ item: true; container?: false } & GridItemProps)
	| ({ item?: false; container: true } & GridContainerProps)

/**
 * An hybrid Flexbox/Grid layout component
 */
export default function FluidGrid(props: GridProps) {
	if (props.container === true) {
		return <GridContainer {...props} />
	} else if (props?.item === true) {
		return <GridItem {...props} />
	}

	return null
}

const StyledGridContainer = styled.div<GridContainerProps>`
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	margin-left: -${({ spacing }) => spacingValues[spacing ?? 0]};
	margin-top: -${({ spacing }) => spacingValues[spacing ?? 0]};
`

const StyledGridItem = styled.div<GridItemProps & ContainerContext>`
	padding-left: ${({ spacing }) => spacingValues[spacing ?? 0]};
	padding-top: ${({ spacing }) => spacingValues[spacing ?? 0]};
	${(props) => breakPointCss(props.xs, props.nbColumns)}

	${(props) =>
		breakPoints
			.filter((id) => props[id])
			.map(
				(id) => css`
					@media (min-width: ${({ theme }) => theme.breakpointsWidth[id]}) {
						${breakPointCss(props[id], props.nbColumns)}
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
	className?: string
} & Record<SpacingKey | 'xs', BreakpointConfig>

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
