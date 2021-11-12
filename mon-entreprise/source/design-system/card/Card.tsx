import { useButton } from '@react-aria/button'
import { Button } from 'DesignSystem/buttons'
import { GenericButtonOrLinkProps } from 'DesignSystem/buttons/Button'
import { H3 } from 'DesignSystem/typography/heading'
import { Body } from 'DesignSystem/typography/paragraphs'
import React, { ReactHTML, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'

export type GenericCardProps = {
	title: React.ReactNode
	children?: React.ReactNode
	icon?: React.ReactNode
} & GenericButtonOrLinkProps

type CardProps = GenericCardProps & {
	ctaLabel: React.ReactNode
	children: React.ReactNode
}
export function Card({
	title,
	icon,
	children,
	ctaLabel,
	...ariaButtonProps
}: CardProps) {
	const elementType: 'a' | 'div' | typeof RouterLink =
		'href' in ariaButtonProps
			? 'a'
			: 'to' in ariaButtonProps
			? RouterLink
			: 'div'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	const titleProps = getTitleProps(title, 'h2')
	return (
		<StyledCardContainer {...ariaButtonProps} {...buttonProps} as={elementType}>
			{icon && <IconContainer>{icon}</IconContainer>}
			<StyledHeader {...titleProps} />
			<CardBody>{children}</CardBody>
			<StyledButton size="XS" light>
				{ctaLabel}
			</StyledButton>
		</StyledCardContainer>
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
	::after {
		height: 1.25rem;
		width: 5rem;
		display: block;
		content: ' ';
		margin: auto;
		border-bottom: 4px solid ${({ theme }) => theme.colors.bases.secondary[500]};
	}
`
const StyledButton = styled(Button)`
	margin: ${({ theme }) => theme.spacings.sm} 0;
`

const IconContainer = styled.div`
	transform: scale(2.3);
	padding: 1rem;
`

const CardBody = styled(Body)`
	flex-grow: 1;
`
export const StyledCardContainer = styled.div`
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
	padding: ${({ theme }) => theme.spacings.lg};
	transition: all 0.15s;
`
