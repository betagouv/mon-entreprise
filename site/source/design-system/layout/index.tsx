import { styled } from 'styled-components'

import { Theme } from '@/types/styled'

export { default as Container } from './Container'
export { default as Grid } from './Grid'

type SpacingProps = (
	| { xxl: true }
	| { xl: true }
	| { lg: true }
	| { md: true }
	| { sm: true }
	| { xs: true }
	| { xxs: true }
) & {
	className?: string
}

export function Spacing(props: SpacingProps) {
	return (
		<SpacingStyled
			$size={
				(['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs'] as const).find(
					(key) => key in props
				) ?? 'md'
			}
			className={props.className}
		/>
	)
}

const SpacingStyled = styled.div<{ $size: keyof Theme['spacings'] }>`
	height: ${({ theme, $size }) => theme.spacings[$size]};
`
