import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

type ButtonProps = {
	color: Color
	size: Size
	to: string
	light?: boolean
	children: ReactNode
}

export const ButtonLink = (props: ButtonProps) => {
	return props.light ? (
		<StyledLightButton {...props} />
	) : (
		<StyledButton {...props} />
	)
}

const StyledButton = styled(Link)<ButtonProps>`
	display: inline-block;
	font-family: ${({ theme }) => theme.fonts.main};
	text-decoration: none;
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

const StyledLightButton = styled(Link)<ButtonProps>`
	display: inline-block;
	font-family: ${({ theme }) => theme.fonts.main};
	text-decoration: none;
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
