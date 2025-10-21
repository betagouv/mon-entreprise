import { useButton } from '@react-aria/button'
import { AriaButtonProps } from '@react-types/button'
import React, {
	ComponentProps,
	ComponentPropsWithRef,
	ForwardedRef,
	useCallback,
	useRef,
} from 'react'
import { NavLink } from 'react-router-dom'
import { css, styled } from 'styled-components'

import { omit } from '@/utils'

export const StyledLinkHover = css`
	text-decoration: underline;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[300]
			: theme.colors.bases.primary[800]};
`

export type StyledLinkProps = {
	$isDisabled?: boolean
	$noUnderline?: boolean
}

export const StyledLinkStyle = css<StyledLinkProps>`
	color: ${({ theme, $isDisabled }) =>
		$isDisabled
			? theme.colors.extended.grey[600]
			: theme.colors.bases.primary[700]};
	background-color: inherit;
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]};
			}
		`}
	${({ $isDisabled }) =>
		$isDisabled &&
		css`
			cursor: default;
		`}
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	text-decoration: ${({ $noUnderline }) =>
		$noUnderline ? 'none' : 'underline'};
	padding: 0;
	font-size: inherit;
	background: none;
	border: none;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	&:hover {
		${({ $isDisabled }) => !$isDisabled && StyledLinkHover}
	}
	&:focus-visible {
		${({ $isDisabled }) =>
			$isDisabled
				? css`
						outline: none;
				  `
				: ''}
	}
`
export const StyledLink = styled.a<StyledLinkProps>`
	${StyledLinkStyle}
`

export const Link = React.forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	GenericButtonOrNavLinkProps & {
		children: React.ReactNode
		isDisabled?: boolean
		noUnderline?: boolean
		to?:
			| string
			| {
					pathname: string
					search: string
			  }
	}
>(function Link(props, forwardedRef) {
	const { isDisabled, noUnderline, type, ...ariaButtonProps } = props
	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, forwardedRef)

	return (
		<StyledLink
			{...buttonOrLinkProps}
			type={type}
			$isDisabled={isDisabled}
			$noUnderline={noUnderline}
			tabIndex={isDisabled ? -1 : undefined}
			as={isDisabled ? 'span' : buttonOrLinkProps.as}
		/>
	)
})

export function useExternalLinkProps({
	href,
	children,
	openInSameWindow,
}: {
	href?: string
	children?: React.ReactNode
	openInSameWindow?: true
}) {
	if (
		openInSameWindow ||
		!href ||
		!(href.match(/^https?:\/\//) || href.match(/\.(pdf|jpe?g|png|docx?)/))
	) {
		return {}
	}

	return {
		target: '_blank',
		rel: 'noreferrer',
		children: children && (
			<>
				{children}
				<NewWindowLinkIcon />
			</>
		),
	}
}

/**
 * This component resolve a conflict beetween styled-component and NavLink,
 * styled-component overwrite the functions in style or className props so we can't use NavLink isActive.
 * To get around that we rename style/className props in useButtonOrLink if
 * they are functions and we pass them to NavLink here
 */
const CustomNavLink = React.forwardRef(function CustomNavLink(
	props: ComponentProps<typeof NavLink> & {
		_style?: ComponentProps<typeof NavLink>['style']
		_className?: ComponentProps<typeof NavLink>['className']
	},
	forwardedRef: ForwardedRef<HTMLAnchorElement | null>
) {
	const navLinkProps = { ...props }
	delete navLinkProps._style
	delete navLinkProps._className

	return (
		<NavLink
			{...navLinkProps}
			style={(...p) => ({
				...props.style,
				...(typeof props._style === 'function' && props._style(...p)),
			})}
			className={(...p) => {
				const styledClass =
					(typeof props.className === 'function'
						? props.className(...p)
						: props.className) ?? ''

				const originalClass =
					(typeof props._className === 'function'
						? props._className(...p)
						: props._className) ?? ''

				return styledClass + ' ' + originalClass
			}}
			ref={forwardedRef}
		/>
	)
})

export type GenericButtonOrNavLinkProps = (
	| AriaButtonProps<'a'>
	| (AriaButtonProps<typeof NavLink> & ComponentPropsWithRef<typeof NavLink>)
	| AriaButtonProps<'button'>
) & {
	openInSameWindow?: true
}

export function useButtonOrLink(
	props: GenericButtonOrNavLinkProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement | null>
) {
	const elementType: 'a' | 'button' | typeof CustomNavLink =
		'href' in props ? 'a' : 'to' in props ? CustomNavLink : 'button'

	const defaultRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
	const { buttonProps } = useButton({ elementType, ...props }, defaultRef)

	const ref = useCallback(
		(instance: HTMLAnchorElement | HTMLButtonElement | null) => {
			defaultRef.current = instance
			if (typeof forwardedRef === 'function') {
				forwardedRef(instance)
			}
			if (forwardedRef && 'current' in forwardedRef) {
				forwardedRef.current = instance
			}
		},
		[forwardedRef]
	)
	const initialProps = Object.fromEntries(
		Object.entries(props).filter(
			([key]) =>
				![
					'onPress',
					'onPressChange',
					'onPressEnd',
					'onPressStart',
					'onPressUp',
					'excludeFromTabOrder',
				].includes(key)
		)
	)

	// Remove role to avoid contradiction with final HTML tag
	const buttonPropsWithoutRole = Object.fromEntries(
		Object.entries(buttonProps).filter(([key]) => key !== 'role')
	)

	// Rename style if it is a function, see CustomNavLink
	const styleProps =
		'to' in props && typeof props.style === 'function'
			? { _style: props.style, style: undefined }
			: {}

	// Rename classname if it is a function, see CustomNavLink
	const classNameProps =
		'to' in props && typeof props.className === 'function'
			? { _className: props.className, className: undefined }
			: {}

	const propsToPass = {
		...initialProps,
		...buttonPropsWithoutRole,
		...useExternalLinkProps(props),
		...classNameProps,
		...styleProps,
		as: elementType,
		ref,
	} as const

	// FIXME Very ugly mais sinon on se récupère un warning parce qu’on passe `openInSameWindow` au DOM … qui n’est même pas censé être dans `propsToPass` d’après TypeScript ! 😭
	// @ts-ignore
	return omit(propsToPass, 'openInSameWindow') as typeof propsToPass
}

export const NewWindowLinkIcon = () => {
	return (
		<StyledSvg
			className="print-hidden"
			viewBox="0 0 24 24"
			aria-hidden
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.46528 7.57897C7.48573 7.02706 7.9497 6.59622 8.50161 6.61667L16.1384 6.89951C16.6616 6.91889 17.0813 7.33858 17.1007 7.86181L17.3835 15.4986C17.404 16.0505 16.9731 16.5145 16.4212 16.5349C15.8693 16.5553 15.4053 16.1245 15.3849 15.5726L15.1364 8.86377L8.42759 8.61529C7.87568 8.59485 7.44484 8.13087 7.46528 7.57897Z"
				// fill="#212529"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.19182 16.8084C6.80129 16.4178 6.80129 15.7847 7.19182 15.3942L15.3943 7.19172C15.7848 6.80119 16.4179 6.80119 16.8085 7.19172C17.199 7.58224 17.199 8.21541 16.8085 8.60593L8.60603 16.8084C8.21551 17.1989 7.58234 17.1989 7.19182 16.8084Z"
				// fill="#212529"
			/>
		</StyledSvg>
	)
}

const StyledSvg = styled.svg`
	width: 1em;
	height: 1em;
	vertical-align: text-top;
	path {
		fill: currentColor;
	}
`
