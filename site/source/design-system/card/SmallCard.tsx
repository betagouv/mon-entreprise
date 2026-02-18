import { useButton } from '@react-aria/button'
import React, { useRef } from 'react'
import { styled } from 'styled-components'

import { Link } from '@/lib/navigation'

import { H6 } from '../typography/heading'
import { NewWindowLinkIcon, useExternalLinkProps } from '../typography/link'
import { SmallBody } from '../typography/paragraphs'
import { GenericCardProps, getTitleProps } from './Card'

export function SmallCard({
	icon,
	children,
	title,
	...ariaButtonProps
}: GenericCardProps & { icon: React.ReactNode }) {
	const elementType: 'a' | 'div' | typeof Link =
		'href' in ariaButtonProps ? 'a' : 'to' in ariaButtonProps ? Link : 'div'

	const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null)
	const { buttonProps } = useButton({ elementType, ...ariaButtonProps }, ref)
	const titleProps = getTitleProps(title, 'h4')
	const linkProps = useExternalLinkProps(ariaButtonProps)

	// Remove role to avoid contradiction with final HTML tag
	const elementPropsWithoutRole = Object.fromEntries(
		Object.entries({
			...ariaButtonProps,
			...buttonProps,
			...linkProps,
		}).filter(([key]) => key !== 'role')
	)

	return (
		<Container {...elementPropsWithoutRole} as={elementType}>
			<IconPlaceholder>{icon}</IconPlaceholder>
			<Content>
				<H6
					style={{
						margin: '0',
					}}
					{...titleProps}
					as="span"
				>
					{titleProps.children}
					{linkProps.target === '_blank' && <NewWindowLinkIcon />}
				</H6>
				{children && <SmallBody>{children}</SmallBody>}
			</Content>
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: row;
	text-decoration: none;
	word-break: break-word;
	cursor: pointer;
	align-items: center;
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.bases.primary[700]
			: theme.colors.bases.primary[200]};
	border-radius: 0.375rem;
	box-shadow: ${({ theme }) =>
		theme.darkMode ? theme.elevationsDarkMode[2] : theme.elevations[2]};
	&:hover {
		box-shadow: ${({ theme }) =>
			theme.darkMode ? theme.elevationsDarkMode[3] : theme.elevations[3]};
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.bases.primary[600]
				: theme.colors.bases.primary[400]};
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
