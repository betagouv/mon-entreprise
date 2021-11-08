import { ComponentPropsWithRef, ReactEventHandler } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

type Size = 'XL' | 'MD' | 'XS'
type Color = 'primary' | 'secondary' | 'tertiary'

export type GenericButtonOrLinkProps =
	| (({ href: string } | { elementType: 'anchor' }) &
			ComponentPropsWithRef<'a'>)
	| ((
			| { onClick: ReactEventHandler<HTMLButtonElement> }
			| { elementType: 'button' }
	  ) &
			ComponentPropsWithRef<'button'>)
	| ComponentPropsWithRef<typeof RouterLink>

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

	if (
		'href' in propsWithDefault ||
		('elementType' in propsWithDefault &&
			propsWithDefault.elementType === 'anchor')
	)
		return (
			<StyledButton
				{...propsWithDefault}
				as="a"
				target="_blank"
				rel="noreferrer"
			/>
		)
	if (
		'onClick' in propsWithDefault ||
		('elementType' in propsWithDefault &&
			propsWithDefault.elementType === 'button')
	)
		return (
			<StyledButton
				{...(propsWithDefault as StyledButtonProps &
					ComponentPropsWithRef<'button'>)}
			/>
		)
	if ('to' in propsWithDefault)
		return <StyledButton as={RouterLink} {...propsWithDefault} />
	else {
		return null
	}
}

type StyledButtonProps = {
	color: Color
	size: Size
	light: boolean
}

const StyledButton = styled.button<StyledButtonProps>`
	background-color: ${({ theme, color }) =>
		theme.colors.bases[color][color === 'primary' ? 700 : 300]};
	color: ${({ theme, color }) =>
		theme.colors.extended.grey[color === 'primary' ? 100 : 800]};
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

	&:active {
		transform: translateY(3px);
	}

	${({ light, color, theme }) =>
		light &&
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
`
