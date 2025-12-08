import { AriaButtonProps } from '@react-types/button'
import React, { ComponentPropsWithRef, ReactHTML, useRef } from 'react'
import { Link as BaseLink } from 'react-router-dom'
import { css, IStyledComponent, styled } from 'styled-components'

import { StyledButton } from '../buttons/Button'
import { H3, H4, HeadingUnderline } from '../typography/heading'
import {
	NewWindowLinkIcon,
	useButtonOrLink,
	useExternalLinkProps,
} from '../typography/link'
import { Body } from '../typography/paragraphs'

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
	bodyAs?: keyof ReactHTML | IStyledComponent<'web'>
	children: React.ReactNode
	className?: string
	compact?: boolean
	ctaLabel?: React.ReactNode
	role?: string
	tabIndex?: number
}

export function Card(props: CardProps) {
	const {
		bodyAs,
		children,
		className,
		compact = false,
		ctaLabel,
		icon,
		tabIndex,
		title,
		...ariaButtonProps
	} = props
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const titleProps = getTitleProps(title, 'h3')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, ref)
	// @ts-ignore
	delete buttonOrLinkProps.title

	return (
		<CardContainer
			compact={compact}
			{...(!ctaLabel ? buttonOrLinkProps : {})}
			tabIndex={tabIndex}
			className={className}
		>
			{icon && <IconContainer className="hide-mobile">{icon}</IconContainer>}
			{title &&
				(compact ? (
					<CompactStyledHeader {...titleProps} />
				) : (
					<StyledHeader {...titleProps} />
				))}
			<div
				style={{
					flex: '1',
					textAlign: 'center',
					width: '100%',
				}}
			>
				<Body as={bodyAs}>{children}</Body>
			</div>
			{ctaLabel && (
				<CardButton
					$size="XS"
					$light
					$color="primary"
					{...buttonOrLinkProps}
					tabIndex={undefined}
				>
					{ctaLabel}
					{linkProps.target === '_blank' && <NewWindowLinkIcon />}
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
	&::after {
		margin: auto;
	}
`
const CardButton = styled(StyledButton)`
	margin: ${({ theme }) => theme.spacings.sm} 0;
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		width: initial;
	}

	/* Hack to transmit state (hover, focused) to card */
	&::before {
		bottom: 0;
		content: '';
		display: block;
		height: 100%;
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		z-index: 1;
	}
`

const IconContainer = styled.div`
	transform: scale(2.3);
	margin-top: ${({ theme }) => theme.spacings.md};
	margin-bottom: 0;
`

export const CardContainer = styled.div.withConfig({
	shouldForwardProp: (prop) => !['compact', 'inert'].includes(prop),
})<{
	compact?: boolean
	inert?: boolean
}>`
	/* Hack to get state from link/button */
	width: 100%;
	height: 100%;
	position: relative;

	display: flex;
	text-decoration: none;
	flex-direction: column;
	align-items: center;
	border: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	background-color: ${({ theme, inert }) =>
		theme.darkMode
			? theme.colors.extended.dark[inert ? 700 : 600]
			: theme.colors.extended.grey[inert ? 200 : 100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme, inert }) =>
			!inert &&
			(theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3])};
		background-color: ${({ theme, inert }) =>
			!inert &&
			(theme.darkMode
				? theme.colors.extended.dark[500]
				: theme.colors.bases.primary[100])};
	}
	padding: ${({ theme: { spacings }, compact = false }) =>
		compact
			? css`
					${spacings.sm} ${spacings.md}
			  `
			: css`
					${spacings.md} ${spacings.lg}
			  `};
	transition:
		box-shadow 0.15s,
		background-color 0.15s;
`
