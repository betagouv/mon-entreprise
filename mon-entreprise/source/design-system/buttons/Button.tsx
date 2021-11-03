import { useButton } from '@react-aria/button'
import { AriaButtonProps } from '@react-types/button'
import { ReactEventHandler, useRef } from 'react'
import styled from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonProps = {
	color?: Color
	size?: Size
	onClick?: ReactEventHandler
	light?: boolean
} & AriaButtonProps<'button'>

export const Button = (props: ButtonProps) => {
	const {
		children,
		color = 'primary',
		size = 'MD',
		light = false,
		onClick,
	} = props
	const buttonRef = useRef<HTMLButtonElement>(null)
	const buttonProps = useButton(props, buttonRef)

	return light ? (
		<StyledLightButton
			{...buttonProps}
			ref={buttonRef}
			color={color}
			size={size}
			onClick={onClick}
		>
			{children}
		</StyledLightButton>
	) : (
		<StyledButton
			{...buttonProps}
			ref={buttonRef}
			color={color}
			size={size}
			onClick={onClick}
		>
			{children}
		</StyledButton>
	)
}

type StyledButtonProps = {
	color: Color
	size: Size
}

const StyledButton = styled.button<StyledButtonProps>`
	background-color: ${({ theme, color }) =>
		theme.colors.bases[color][color === 'primary' ? 700 : 300]};
	color: ${({ theme, color }) =>
		theme.colors.extended.grey[color === 'primary' ? 100 : 800]};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};

	border-radius: 2.5rem;
	font-size: 1rem;
	line-height: 1.5rem;

	&:hover {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 800 : color === 'secondary' ? 500 : 400
			]};
	}

	&:disabled {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][color === 'primary' ? 200 : 100]};
		color: ${({ theme, color }) =>
			theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
	}
`

const StyledLightButton = styled.button<StyledButtonProps>`
	border: 2px solid
		${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 700 : color === 'secondary' ? 500 : 300
			]};
	color: ${({ theme, color }) =>
		theme.colors.bases[color][color === 'primary' ? 700 : 700]};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};

	border-radius: 2.5rem;
	font-size: 1rem;
	line-height: 1.5rem;

	&:hover {
		background-color: ${({ theme, color }) =>
			theme.colors.bases[color][
				color === 'primary' ? 200 : color === 'secondary' ? 100 : 100
			]};
	}

	&:disabled {
		border-color: ${({ theme, color }) =>
			theme.colors.bases[color][color === 'primary' ? 200 : 100]};
		color: ${({ theme, color }) =>
			theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
	}
`
