import { StyledButton } from 'DesignSystem/buttons/Button'
import { FocusStyle } from 'DesignSystem/global-style'
import { H3, HeadingUnderline } from 'DesignSystem/typography/heading'
import {
	GenericButtonOrLinkProps,
	NewWindowLinkIcon,
	useButtonOrLink,
	useExternalLinkProps,
} from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import React, { ReactHTML, useRef } from 'react'
import styled from 'styled-components'

export type GenericCardProps = {
	title: React.ReactNode
	children?: React.ReactNode
	icon?: React.ReactNode
} & GenericButtonOrLinkProps

type CardProps = GenericCardProps & {
	ctaLabel?: React.ReactNode
	children: React.ReactNode
}

export function Card({
	title,
	icon,
	children,
	ctaLabel,
	...ariaButtonProps
}: CardProps) {
	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const titleProps = getTitleProps(title, 'h2')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	const buttonOrLinkProps = useButtonOrLink(ariaButtonProps, ref)

	return (
		<CardContainer {...buttonOrLinkProps}>
			{icon && <IconContainer>{icon}</IconContainer>}
			<StyledHeader {...titleProps} />
			<div
				css={`
					flex: 1;
					text-align: center;
				`}
			>
				<Body>{children}</Body>
			</div>
			{ctaLabel && (
				// The button is not selectable with keyboard navigation because the whole card already is
				<CardButton tabIndex={-1} size="XS" light color="primary">
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

const StyledHeader = styled(H3)`
	text-align: center;
	${HeadingUnderline}
	::after {
		margin: auto;
	}
`
const CardButton = styled(StyledButton)`
	margin: ${({ theme }) => theme.spacings.sm} 0;
`

const IconContainer = styled.div`
	transform: scale(2.3);
	margin-top: ${({ theme }) => theme.spacings.md};
`

export const CardContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	text-decoration: none;
	cursor: pointer;
	flex-direction: column;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	box-shadow: ${({ theme }) => theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) => theme.elevations[3]};
	}
	&:focus-visible {
		${FocusStyle}
	}
	padding: ${({ theme }) => theme.spacings.lg};
	transition: box-shadow 0.15s;
`
