import { useButton } from '@react-aria/button'
import React, { useRef } from 'react'
import { styled } from 'styled-components'

import { Link } from '@/lib/navigation'

import { ChevronIcon } from '../icons'
import { H4 } from '../typography/heading'
import { NewWindowLinkIcon, useExternalLinkProps } from '../typography/link'
import { Body } from '../typography/paragraphs'
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

	// Remove role to avoid contradiction with final HTML tag
	const elementPropsWithoutRole = Object.fromEntries(
		Object.entries({
			...ariaButtonProps,
			...buttonProps,
			...linkProps,
		}).filter(([key]) => key !== 'role')
	)

	return (
		<StyledArticle>
			<StyledHeader as={titleProps.as}>
				{titleProps.children} {icon}
			</StyledHeader>
			<Content>{children}</Content>
			<StyledBody {...elementPropsWithoutRole} as={elementType}>
				{ctaLabel}
				{linkProps.target === '_blank' && <NewWindowLinkIcon />}
				<StyledChevron aria-hidden />
			</StyledBody>
		</StyledArticle>
	)
}

const StyledArticle = styled.div`
	padding: ${({ theme }) => theme.spacings.lg};
	padding-top: ${({ theme }) => theme.spacings.sm};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: solid 1px ${({ theme }) => theme.colors.extended.grey[600]};
	transition: background-color 0.15s;
	cursor: pointer;
	display: block;
	text-decoration: none;

	/* Hack to transmit hover to link */
	width: 100%;
	height: 100%;
	position: relative;

	&:hover {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.secondary[600]
				: theme.colors.bases.secondary[100]};
	}
`

const StyledHeader = styled(H4)`
	color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[200]
			: theme.colors.bases.primary[600]};
	background-color: transparent;
`

const StyledChevron = styled(ChevronIcon)`
	margin-left: ${({ theme }) => theme.spacings.xxs};
`

const Content = styled(Body)`
	background-color: transparent;
`

const StyledBody = styled(Body)`
	display: flex;
	align-items: center;

	/** Hack to get hover from parent */
	&::before {
		content: '';
		inset: 0;
		box-sizing: inherit;
		z-index: 1;
		position: absolute;
	}
	&,
	& * {
		color: ${({ theme }) => theme.colors.bases.primary[700]};
		font-weight: 700;
	}

	&:hover {
		text-decoration: none;
	}
`
