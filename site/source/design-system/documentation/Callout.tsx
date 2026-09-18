import React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ForceThemeProvider } from '@/components/utils/DarkModeContext'

import { Body, Strong } from '../typography'
import { estTexteBrut } from '../utils'

type Props = {
	titre: string
	children: React.ReactNode
	type?: 'tip' | 'note' | 'important' | 'caution'
	icon?: string
}

const Callout = ({ titre, children, type, icon }: Props) => {
	const childrenEstTexteBrut = estTexteBrut(children)

	return (
		<ForceThemeProvider forceTheme="light">
			<CalloutDiv type={type} icon={icon}>
				<Strong>{titre}</Strong>
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
		<Callout
			titre={t('components.callout.conseil', 'Conseil')}
			type="tip"
			icon="💡"
		>
			{children}
		</Callout>
	)
}

export const Attention = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout
			titre={t('components.callout.attention', 'Attention')}
			type="caution"
			icon="⚠️"
		>
			{children}
		</Callout>
	)
}

export const Info = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout
			titre={t('components.callout.information', 'Information')}
			type="important"
			icon="ℹ️"
		>
			{children}
		</Callout>
	)
}

export const Note = ({ children }: { children: React.ReactNode }) => {
	const { t } = useTranslation()

	return (
		<Callout titre={t('components.callout.note', 'Note')} type="note" icon="📝">
			{children}
		</Callout>
	)
}
