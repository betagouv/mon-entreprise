import { useButton } from '@react-aria/button'
import { AriaButtonProps } from '@react-types/button'
import { FocusStyle } from 'DesignSystem/global-style'
import React, {
	ComponentPropsWithRef,
	ForwardedRef,
	useCallback,
	useRef,
} from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

export const StyledLinkHover = css`
	text-decoration: underline;
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[100]
			: theme.colors.bases.primary[800]};
`
export const StyledLink = styled.a`
	color: ${({ theme }) => theme.colors.bases.primary[700]};
	${({ theme }) =>
		theme.darkMode &&
		css`
			@media not print {
				color: ${theme.colors.extended.grey[100]};
			}
		`}
	font-family: ${({ theme }) => theme.fonts.main};
	font-weight: 700;
	padding: 0;
	font-size: inherit;
	text-decoration: none;
	border-radius: ${({ theme }) => theme.box.borderRadius};
	&:hover {
		${StyledLinkHover}
	}
	&:focus-visible {
		${FocusStyle}
	}
`

export const Link = React.forwardRef<
	HTMLAnchorElement | HTMLButtonElement,
	GenericButtonOrLinkProps & { children: React.ReactNode }
>(function Link(ariaButtonProps, forwardedRef) {
	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, forwardedRef)
	return <StyledLink {...buttonOrLinkProps} />
})

export function useExternalLinkProps({
	title,
	href,
	children,
	openInSameWindow,
}: {
	title?: string | null
	href?: string
	children?: React.ReactNode
	openInSameWindow?: true
}) {
	const { t } = useTranslation()
	if (
		openInSameWindow ||
		!href ||
		!(href.match(/^https?:\/\//) || href.match(/\.(pdf|jpe?g|png|docx?)/))
	) {
		return {}
	}

	return {
		title: (title ? `${title} - ` : '') + t('Nouvelle fenêtre'),
		target: '_blank',
		external: true,
		children: children && (
			<>
				{children}
				<NewWindowLinkIcon />
			</>
		),
	}
}

export type GenericButtonOrLinkProps =
	| ({
			href: string
			title?: string
			openInSameWindow?: true
	  } & AriaButtonProps<'a'>)
	| (AriaButtonProps<typeof NavLink> & ComponentPropsWithRef<typeof NavLink>)
	| AriaButtonProps<'button'>

export function useButtonOrLink(
	props: GenericButtonOrLinkProps,
	forwardedRef: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
	const elementType: 'a' | 'button' | typeof NavLink =
		'href' in props ? 'a' : 'to' in props ? NavLink : 'button'

	const defaultRef = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null)
	const { buttonProps } = useButton({ elementType, ...props }, defaultRef)

	const ref = useCallback(
		(instance) => {
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

	const buttonOrLinkProps = {
		...initialProps,
		...buttonProps,
		...useExternalLinkProps(props),
		as: elementType,
		ref: ref as any,
	} as any
	return buttonOrLinkProps
}

export const NewWindowLinkIcon = () => {
	return (
		<StyledSvg
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
