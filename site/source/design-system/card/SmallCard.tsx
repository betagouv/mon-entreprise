import { useButton } from '@react-aria/button'
import { FocusStyle } from 'DesignSystem/global-style'
import { H6 } from 'DesignSystem/typography/heading'
import {
	NewWindowLinkIcon,
	useExternalLinkProps,
} from 'DesignSystem/typography/link'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import React, { useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { GenericCardProps, getTitleProps } from './Card'

export function SmallCard({
	icon,
	children,
	title,
	...ariaButtonProps
}: GenericCardProps & { icon: React.ReactNode }) {
	const elementType: 'a' | 'div' | typeof RouterLink =
		'href' in ariaButtonProps
			? 'a'
			: 'to' in ariaButtonProps
			? RouterLink
			: 'div'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	const titleProps = getTitleProps(title, 'h4')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	return (
		<Container
			{...ariaButtonProps}
			{...buttonProps}
			{...linkProps}
			as={elementType}
		>
			<IconPlaceholder>{icon}</IconPlaceholder>
			<Content>
				<H6
					css={`
						margin: 0;
					`}
					{...titleProps}
				>
					{titleProps.children}
					{linkProps.external && <NewWindowLinkIcon />}
				</H6>
				{children && <SmallBody>{children}</SmallBody>}
			</Content>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	max-height: 120px;
	flex-direction: row;
	text-decoration: none;
	cursor: pointer;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.bases.primary[200]};
	border-radius: 0.375rem;
	box-shadow: ${({ theme }) => theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) => theme.elevations[3]};
		background-color: ${({ theme }) => theme.colors.bases.primary[400]};
	}
	&:focus-visible {
		${FocusStyle}
	}
	padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	width: 100%;
	height: 100%;
	transition: background-color box-shadow 0.15s;
`

const IconPlaceholder = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 4.5rem;
	width: 4.5rem;
	flex-shrink: 0;
	border-radius: 100%;
	background-color: ${({ theme }) => theme.colors.extended.grey[100]};

	& > img {
		width: 40% !important;
		height: 40% !important;
	}
`

const Content = styled.div`
	display: flex;
	max-height: 100%;

	flex-direction: column;
	align-items: flex-start;
	margin-left: 1rem;
`
