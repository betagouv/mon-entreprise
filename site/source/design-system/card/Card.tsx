import { AriaButtonProps } from '@react-types/button'
import React, { ComponentPropsWithRef, ReactHTML, useRef } from 'react'
import { Link as BaseLink, useNavigate } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { StyledButton } from '@/design-system/buttons/Button'
import { H3, H4, HeadingUnderline } from '@/design-system/typography/heading'
import {
	NewWindowLinkIcon,
	useButtonOrLink,
	useExternalLinkProps,
} from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

type GenericButtonOrLinkProps = (
	| AriaButtonProps<'a'>
	| (AriaButtonProps<typeof BaseLink> & ComponentPropsWithRef<typeof BaseLink>)
	| AriaButtonProps<'button'>
) & {
	openInSameWindow?: true
}

export type GenericCardProps = {
	title?: React.ReactNode
	children?: React.ReactNode
	icon?: React.ReactNode
} & GenericButtonOrLinkProps

type CardProps = GenericCardProps & {
	ctaLabel?: React.ReactNode
	children: React.ReactNode
	compact?: boolean
	bodyAs?: React.ComponentProps<typeof Body>['as']
	role?: string
	tabIndex?: number
	onClick?: () => void
	className?: string
}

export function Card(props: CardProps) {
	const {
		title,
		icon,
		children,
		ctaLabel,
		compact = false,
		bodyAs,
		role,
		tabIndex,
		onClick,
		className,
		...ariaButtonProps
	} = props
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const titleProps = getTitleProps(title, 'h3')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	const navigate = useNavigate()

	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, ref)
	// @ts-ignore
	delete buttonOrLinkProps.title

	const handleClick = () => {
		if (onClick) {
			onClick()
		}
		navigate(
			(
				buttonOrLinkProps as typeof buttonOrLinkProps & {
					to: { pathname: string }
				}
			).to.pathname || ''
		)
	}

	return (
		<CardContainer
			$compact={compact}
			tabIndex={tabIndex}
			onClick={handleClick}
			className={className}
		>
			{icon && <IconContainer>{icon}</IconContainer>}
			{title &&
				(compact ? (
					<CompactStyledHeader {...titleProps} />
				) : (
					<StyledHeader {...titleProps} />
				))}
			<div
				css={`
					flex: 1;
					text-align: center;
					width: 100%;
				`}
			>
				<Body as={bodyAs}>{children}</Body>
			</div>
			{ctaLabel && (
				<CardButton
					$size="XS"
					$light
					$color="primary"
					{...buttonOrLinkProps}
					role={role || buttonOrLinkProps?.role}
					tabIndex={undefined}
				>
					{ctaLabel}
					{linkProps.external && <NewWindowLinkIcon />}
				</CardButton>
			)}
		</CardContainer>
	)
}

/*
Default header to "as". Otherwise, use the same header level as provided
while keeping the same consistent style
*/
export function getTitleProps(children: React.ReactNode, as: keyof ReactHTML) {
	if (
		children &&
		typeof children === 'object' &&
		'type' in children &&
		typeof children.type === 'string' &&
		/^h[\d]$/.exec(children.type)
	) {
		as = children.type as keyof ReactHTML
		children = children.props.children ?? null
	}

	return { as, children }
}
const CompactStyledHeader = styled(H4)`
	text-align: center;
`
const StyledHeader = styled(H3)`
	text-align: center;
	${HeadingUnderline}
	::after {
		margin: auto;
	}
`
const CardButton = styled(StyledButton)`
	margin: ${({ theme }) => theme.spacings.sm} 0;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		width: initial;
	}

	&::before {
		content: '';
		inset: 0;
		box-sizing: inherit;
		z-index: 1;
		position: absolute;
	}
`

const IconContainer = styled.div`
	transform: scale(2.3);
	margin-top: ${({ theme }) => theme.spacings.md};
`

export const CardContainer = styled.div<{
	$compact?: boolean
	$inert?: boolean
}>`
	display: flex;
	width: 100%;
	height: 100%;
	position: relative;
	text-decoration: none;
	flex-direction: column;
	align-items: center;
	border: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	background-color: ${({ theme, $inert }) =>
		theme.darkMode
			? theme.colors.extended.dark[$inert ? 700 : 600]
			: theme.colors.extended.grey[$inert ? 200 : 100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme, $inert }) =>
			!$inert &&
			(theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3])};
		background-color: ${({ theme, $inert }) =>
			!$inert &&
			(theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100])};
	}
	padding: ${({ theme: { spacings }, $compact = false }) =>
		$compact
			? css`
					${spacings.sm} ${spacings.md}
			  `
			: css`
					${spacings.md} ${spacings.lg}
			  `};
	transition: box-shadow 0.15s, background-color 0.15s;
`
