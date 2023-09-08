import styled from 'styled-components'

export { default as Container } from './Container'
export { default as Grid } from './Grid'

export const Spacing = styled.div<
	| { xxl: true }
	| { xl: true }
	| { lg: true }
	| { md: true }
	| { sm: true }
	| { xs: true }
	| { xxs: true }
>`
	min-height: ${({ theme, ...props }) =>
		'xxl' in props
			? theme.spacings.xxl
			: 'xl' in props
			? theme.spacings.xl
			: 'lg' in props
			? theme.spacings.lg
			: 'md' in props
			? theme.spacings.md
			: 'sm' in props
			? theme.spacings.sm
			: 'xs' in props
			? theme.spacings.xs
			: theme.spacings.xxs};
`
