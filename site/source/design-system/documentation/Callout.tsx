import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'

import { Body } from '../typography'

type Props = {
	children: React.ReactNode
	type?: 'tip' | 'note' | 'important' | 'caution'
	icon?: string
}

const Callout = ({ children, type, icon }: Props) => {
	const childrenEstTexteBrut =
		typeof children === 'string' ||
		(Array.isArray(children) &&
			children.length === 1 &&
			typeof children[0] === 'string')

	return (
		<ForceThemeProvider forceTheme="light">
			<CalloutDiv type={type} icon={icon}>
				{childrenEstTexteBrut ? <Body>{children}</Body> : children}
			</CalloutDiv>
		</ForceThemeProvider>
	)
}

const CalloutDiv = styled.div.withConfig({
	shouldForwardProp: (prop) => !['type', 'icon'].includes(prop),
})<Pick<Props, 'type' | 'icon'>>`
	padding: ${({ theme }) => `${theme.spacings.md} ${theme.spacings.lg}`};
	margin: ${({ theme }) => `${theme.spacings.lg} 0`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid;
	position: relative;

	${({ theme, icon }) =>
		icon &&
		`
		&::before {
			content: '${icon}';
			font-size: ${theme.fontSizes.xl};
			margin-right: 0.5rem;
		}
	`}

	${({ type = 'note', theme }) => {
		switch (type) {
			case 'tip':
				return `
					background-color: ${theme.colors.extended.success[100]};
					border-color: ${theme.colors.extended.success[300]};
					color: ${theme.colors.extended.success[600]};
				`
			case 'important':
				return `
					background-color: ${theme.colors.extended.info[100]};
					border-color: ${theme.colors.extended.info[300]};
					color: ${theme.colors.extended.info[600]};
				`
			case 'caution':
				return `
					background-color: ${theme.colors.extended.error[100]};
					border-color: ${theme.colors.extended.error[300]};
					color: ${theme.colors.extended.error[600]};
				`
			default:
				return `
					background-color: ${theme.colors.bases.primary[100]};
					border-color: ${theme.colors.bases.primary[300]};
					color: ${theme.colors.bases.primary[800]};
				`
		}
	}}

	& * {
		color: inherit;
	}

	p:last-child {
		margin-bottom: 0;
	}
`

export const Conseil = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout type="tip" icon="💡">
			<strong>{t('components.callout.conseil', 'Conseil')}</strong>
			{children}
		</Callout>
	)
}

export const Attention = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout type="caution" icon="⚠️">
			<strong>{t('components.callout.attention', 'Attention')}</strong>
			{children}
		</Callout>
	)
}

export const Info = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout type="important" icon="ℹ️">
			<strong>{t('components.callout.information', 'Information')}</strong>
			{children}
		</Callout>
	)
}

export const Note = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout type="note" icon="📝">
			<strong>{t('components.callout.note', 'Note')}</strong>
			{children}
		</Callout>
	)
}
