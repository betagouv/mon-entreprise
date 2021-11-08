import { ComponentPropsWithRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

export type GenericButtonOrLinkProps =
	| ({ href: string } & ComponentPropsWithRef<'a'>)
	| ComponentPropsWithRef<typeof RouterLink>
	| ComponentPropsWithRef<'button'>

type ButtonProps = GenericButtonOrLinkProps & {
	color?: Color
	children: React.ReactNode
	size?: Size
	light?: boolean
}

export const Button = (props: ButtonProps) => {
	const propsWithDefault = {
		size: props.size ?? 'MD',
		light: props.light ?? false,
		color: props.color ?? 'primary',
		...props,
	}

	if ('href' in propsWithDefault) {
		return (
			<StyledButton
				{...propsWithDefault}
				as="a"
				target="_blank"
				rel="noreferrer"
			/>
		)
	}
	if ('to' in propsWithDefault) {
		return <StyledButton as={RouterLink} {...propsWithDefault} />
	}
	return <StyledButton {...propsWithDefault} />
}

type StyledButtonProps = {
	color: Color
	size: Size
	light: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
	text-decoration: none;
	font-family: ${({ theme }) => theme.fonts.main};
	padding: ${({ size }) => {
		if (size === 'XL') return '1.25rem 2rem'
		if (size === 'MD') return '0.875rem 2rem'
		if (size === 'XS') return '0.5rem 2rem'
	}};

	border-radius: 2.5rem;
	transition: all 0.15s;
	font-size: 1rem;
	line-height: 1.5rem;

	/* Primary, secondary & tertiary colors */
	${({ theme, color }) =>
		!theme.darkMode &&
		css`
			&:hover {
				background-color: ${theme.colors.bases[color][
					color === 'primary' ? 800 : color === 'secondary' ? 500 : 400
				]};
			}

			&:disabled {
				background-color: ${theme.colors.bases[color][
					color === 'primary' ? 200 : 100
				]};
				color: ${theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
			}
			background-color: ${theme.colors.bases[color][
				color === 'primary' ? 700 : 300
			]};
			color: ${theme.colors.extended.grey[color === 'primary' ? 100 : 800]};
			&:active {
				transform: translateY(3px);
			}
		`}

	/* Primary, secondary & tertiary light colors */
	${({ light, color, theme }) =>
		light &&
		!theme.darkMode &&
		css`
			border: 2px solid
				${theme.colors.bases[color][
					color === 'primary' ? 700 : color === 'secondary' ? 500 : 300
				]};
			color: ${theme.colors.bases[color][color === 'primary' ? 700 : 700]};
			background-color: ${theme.colors.extended.grey[100]};
			&:hover {
				background-color: ${theme.colors.bases[color][
					color === 'primary' ? 200 : color === 'secondary' ? 100 : 100
				]};
			}

			&:disabled {
				border-color: ${theme.colors.bases[color][
					color === 'primary' ? 200 : 100
				]};
				color: ${theme.colors.extended.grey[color === 'primary' ? 100 : 400]};
			}
		`}

	/* White color (dark background mode) */
	${({ theme }) =>
		theme.darkMode &&
		css`
			background-color: ${theme.colors.extended.grey[100]};
			color: transparent;
			&:hover {
				opacity: 80%;
			}

			&:disabled {
				opacity: 50%;
			}
		`}

		/* White color and light mode (dark background mode) */
		${({ light, theme }) =>
		theme.darkMode &&
		light &&
		css`
			background-color: transparent;
			border-color: 2px solid ${theme.colors.extended.grey[100]};
			color: ${theme.colors.extended.grey[100]};
			&:hover {
				color: rgba(255, 255, 255, 25%);
				opacity: 1;
			}
		`}
`
