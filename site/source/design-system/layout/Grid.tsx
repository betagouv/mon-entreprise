import { ComponentType, createContext, ReactNode, useContext } from 'react'
import styled, { css } from 'styled-components'

import { SpacingKey } from '../theme'

const breakPoints = ['sm', 'md', 'lg', 'xl'] as Array<SpacingKey>

type ContainerContext = {
	nbColumns: number
	rowSpacing: number
	columnSpacing: number
}

const GridContainerContext = createContext<ContainerContext>({
	nbColumns: 12,
	columnSpacing: 0,
	rowSpacing: 0,
})

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
			max-width: ${(breakPointConfig / nbColumns) * 100}%;
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
	margin-left: -${({ theme, columnSpacing }) => theme.spacing[columnSpacing ?? 0]};
	margin-top: -${({ theme, rowSpacing }) => theme.spacing[rowSpacing ?? 0]};
	width: calc(
		100% + ${({ theme, rowSpacing }) => theme.spacing[rowSpacing ?? 0]}
	);
`

const StyledGridItem = styled.div<GridItemProps & ContainerContext>`
	padding-left: ${({ theme, columnSpacing }) =>
		theme.spacing[columnSpacing ?? 0]};
	padding-top: ${({ theme, rowSpacing }) => theme.spacing[rowSpacing ?? 0]};
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
	columnSpacing?: number
	rowSpacing?: number
	children: React.ReactNode
	as?: string | ComponentType<any> | undefined
} & React.ComponentPropsWithoutRef<'div'>

function GridContainer({
	columns = 12,
	spacing = 0,
	columnSpacing,
	rowSpacing,
	children,
	...otherProps
}: GridContainerProps) {
	return (
		<GridContainerContext.Provider
			value={{
				nbColumns: columns,
				columnSpacing: columnSpacing ?? spacing,
				rowSpacing: rowSpacing ?? spacing,
			}}
		>
			<StyledGridContainer
				columnSpacing={columnSpacing ?? spacing}
				rowSpacing={rowSpacing ?? spacing}
				{...otherProps}
			>
				{children}
			</StyledGridContainer>
		</GridContainerContext.Provider>
	)
}

type GridItemProps = {
	children?: React.ReactNode
	className?: string
	as?: string | ComponentType<any> | undefined
} & Partial<Record<SpacingKey | 'xs', BreakpointConfig>> &
	React.ComponentPropsWithoutRef<'div'>

function GridItem({
	xs,
	sm,
	md,
	lg,
	xl,
	children,
	...otherProps
}: GridItemProps) {
	const containerContext = useContext(GridContainerContext)

	return (
		<StyledGridItem
			{...{ xs, sm, md, lg, xl, ...containerContext, ...otherProps }}
		>
			{children}
		</StyledGridItem>
	)
}
