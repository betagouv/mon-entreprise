import * as Array from 'effect/Array'
import React, { ComponentPropsWithRef, JSX, useRef } from 'react'
import { AriaButtonProps } from 'react-aria'
import { css, IStyledComponent, styled } from 'styled-components'

import { Link as BaseLink } from '@/lib/navigation'

import { StyledButton } from '../buttons/Button'
import { H3, H4 } from '../typography/heading'
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
	bodyAs?: keyof JSX.IntrinsicElements | IStyledComponent<'web'>
	children: React.ReactNode
	className?: string
	compact?: boolean
	ctaLabel?: React.ReactNode
	darkerBackground?: boolean
	role?: string
	tabIndex?: number
	précision?: string
}

export function Card(props: CardProps) {
	const {
		bodyAs,
		children,
		className,
		compact = false,
		ctaLabel,
		icon,
		darkerBackground = false,
		tabIndex,
		title,
		précision,
		...ariaButtonProps
	} = props
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const linkProps = useExternalLinkProps(ariaButtonProps)

	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, ref)
	// @ts-ignore
	delete buttonOrLinkProps.title

	const withChildren = Array.isArray(children)
		? Array.some(children, (child) => !!child)
		: !!children

	return (
		<CardContainer
			className={className}
			compact={compact}
			{...(!ctaLabel ? buttonOrLinkProps : {})}
			darkerBackground={darkerBackground}
			tabIndex={tabIndex}
		>
			<ContentContainer>
				{icon && <IconContainer>{icon}</IconContainer>}

				{title &&
					(compact ? (
						<StyledH4 as="h3">{title}</StyledH4>
					) : (
						<StyledH3>{title}</StyledH3>
					))}

				{précision && (
					<CenteredBodyWithoutMargin>{précision}</CenteredBodyWithoutMargin>
				)}

				{withChildren && (
					<div
						style={{
							flex: '1',
							width: '100%',
						}}
					>
						<Body as={bodyAs}>{children}</Body>
					</div>
				)}
			</ContentContainer>

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

export const CardContainer = styled.div.withConfig({
	shouldForwardProp: (prop) =>
		!['compact', 'inert', 'darkerBackground'].includes(prop),
})<{
	compact?: boolean
	inert?: boolean
	darkerBackground?: boolean
}>`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	row-gap: ${({ theme }) => theme.spacings.md};
	position: relative;

	width: 100%;
	height: 100%;
	padding: ${({ theme: { spacings }, compact = false }) =>
		compact
			? css`
					${spacings.sm} ${spacings.md}
				`
			: css`
					${spacings.lg}
				`};
	border: solid 1px ${({ theme }) => theme.colors.extended.grey[300]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};

	background: ${({ theme, inert, darkerBackground }) =>
		darkerBackground
			? theme.darkMode
				? theme.colors.extended.dark[700]
				: theme.colors.bases.primary[100]
			: theme.darkMode
				? theme.colors.extended.dark[inert ? 800 : 600]
				: theme.colors.extended.grey[inert ? 200 : 100]};

	transition:
		box-shadow 0.15s,
		background-color 0.15s;

	&:hover {
		box-shadow: ${({ theme, inert }) =>
			!inert &&
			(theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3])};

		background: ${({ theme, inert, darkerBackground }) =>
			!inert &&
			(darkerBackground
				? theme.darkMode
					? theme.colors.bases.primary[800]
					: theme.colors.bases.primary[200]
				: theme.darkMode
					? theme.colors.extended.dark[500]
					: theme.colors.bases.primary[100])};
	}
`

const ContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	row-gap: ${({ theme }) => theme.spacings.xs};
`

const IconContainer = styled.div`
	margin-bottom: ${({ theme }) => theme.spacings.xs};
	margin-top: ${({ theme }) => theme.spacings.md};
	transform: scale(2);
	@media (max-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		display: none;
	}
`

const StyledH3 = styled(H3)`
	margin: 0;
	text-align: center;

	> div {
		padding: ${({ theme }) => theme.spacings.xxs} 0 0 0;
	}
`

const StyledH4 = styled(H4)`
	text-align: center;
`

const CenteredBodyWithoutMargin = styled(Body)`
	margin-top: 0;
	margin-bottom: 0;
	text-align: center;
`

const CardButton = styled(StyledButton)`
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
