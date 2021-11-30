import { useButton } from '@react-aria/button'
import { FocusStyle } from 'DesignSystem/global-style'
import { Chevron } from 'DesignSystem/icons'
import { H4 } from 'DesignSystem/typography/heading'
import {
	NewWindowLinkIcon,
	StyledLink,
	StyledLinkHover,
	useExternalLinkProps,
} from 'DesignSystem/typography/link'
import { Body } from 'DesignSystem/typography/paragraphs'
import React, { useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { GenericCardProps, getTitleProps } from './Card'

type ArticleProps = GenericCardProps & {
	ctaLabel: React.ReactNode
	children: React.ReactNode
}

export function Article({
	title,
	ctaLabel,
	children,
	icon,
	...ariaButtonProps
}: ArticleProps) {
	const elementType: 'a' | 'div' | typeof RouterLink =
		'href' in ariaButtonProps
			? 'a'
			: 'to' in ariaButtonProps
			? RouterLink
			: 'div'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	const titleProps = getTitleProps(title, 'h3')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	return (
		<StyledArticle
			{...ariaButtonProps}
			{...buttonProps}
			{...linkProps}
			as={elementType}
		>
			<StyledHeader as={titleProps.as}>
				{titleProps.children} {icon}
			</StyledHeader>
			<Body>{children}</Body>
			<StyledLink
				as="span"
				css={`
					display: flex;
					align-items: center;
				`}
			>
				{ctaLabel}
				{linkProps.external && <NewWindowLinkIcon />}
				<StyledChevron aria-hidden />
			</StyledLink>
		</StyledArticle>
	)
}

const StyledArticle = styled.div`
	padding: ${({ theme }) => theme.spacings.lg};
	padding-top: ${({ theme }) => theme.spacings.sm};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	transition: background-color 0.15s;
	cursor: pointer;
	display: block;
	text-decoration: none;
	&:hover {
		background-color: ${({ theme }) => theme.colors.bases.secondary[100]};
	}
	&:hover ${StyledLink} {
		${StyledLinkHover}
	}
	&:focus-visible {
		${FocusStyle}
	}
`

const StyledHeader = styled(H4)`
	color: ${({ theme }) => theme.colors.bases.primary[600]};
`

const StyledChevron = styled(Chevron)`
	margin-left: ${({ theme }) => theme.spacings.xxs};
`
