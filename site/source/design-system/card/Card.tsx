import React, { ComponentPropsWithRef, useRef } from 'react'
import { AriaButtonProps } from 'react-aria'
import { styled } from 'styled-components'

import { Link as BaseLink } from '@/lib/navigation'

import { StyledButton } from '../buttons/Button'
import { H3 } from '../typography/heading'
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
)

export type GenericCardProps = {
	title?: React.ReactNode
	children?: React.ReactNode
	icon?: React.ReactNode
} & GenericButtonOrLinkProps

type CardProps = GenericCardProps & {
	children: React.ReactNode
	className?: string
	ctaLabel?: React.ReactNode
	darkerBackground?: boolean
	subtitle?: string
	headingLevel?: 'h3' | 'h4'
}

export function Card(props: CardProps) {
	const {
		children,
		className,
		ctaLabel,
		icon,
		darkerBackground = false,
		title,
		subtitle,
		headingLevel = 'h3',
		...ariaButtonProps
	} = props
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const linkProps = useExternalLinkProps(ariaButtonProps)

	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, ref)
	// @ts-ignore
	delete buttonOrLinkProps.title

	const withChildren = React.Children.toArray(children).length > 0

	return (
		<CardContainer
			className={className}
			{...(!ctaLabel ? buttonOrLinkProps : {})}
			darkerBackground={darkerBackground}
		>
			<ContentContainer>
				{icon && <IconContainer>{icon}</IconContainer>}

				{title && <StyledH3 as={headingLevel}>{title}</StyledH3>}

				{subtitle && (
					<CenteredBodyWithoutMargin>{subtitle}</CenteredBodyWithoutMargin>
				)}

				{withChildren && <Body>{children}</Body>}
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
	shouldForwardProp: (prop) => !['inert', 'darkerBackground'].includes(prop),
})<{
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
	padding: ${({ theme }) => theme.spacings.lg};
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
