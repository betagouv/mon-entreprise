import { FocusStyle } from '@/design-system/global-style'
import { Chevron } from '@/design-system/icons'
import { H4 } from '@/design-system/typography/heading'
import {
	NewWindowLinkIcon,
	StyledLink,
	StyledLinkHover,
	useExternalLinkProps,
} from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useButton } from '@react-aria/button'
import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
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
	const elementType: 'a' | 'div' | typeof Link =
		'href' in ariaButtonProps ? 'a' : 'to' in ariaButtonProps ? Link : 'div'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	const titleProps = getTitleProps(title, 'h3')
	const linkProps = useExternalLinkProps({
		...(typeof title === 'string' ? { title } : {}),
		...ariaButtonProps,
	})

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
