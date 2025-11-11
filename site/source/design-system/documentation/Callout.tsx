import React from 'react'
import { styled } from 'styled-components'

export const Callout = styled.div.withConfig({
	shouldForwardProp: (prop) => !['type', 'icon'].includes(prop),
})<{
	type?: 'tip' | 'note' | 'important' | 'caution'
	icon?: string
}>`
	padding: ${({ theme }) => `${theme.spacings.md} ${theme.spacings.lg}`};
	margin: ${({ theme }) => `${theme.spacings.lg} 0`};
	border-radius: ${({ theme }) => theme.box.borderRadius};
	border: 1px solid;
	position: relative;

	${({ icon }) =>
		icon &&
		`
		&::before {
			content: '${icon}';
			font-size: 1.25rem;
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

	p:last-child {
		margin-bottom: 0;
	}
`

export const Conseil = ({ children }: { children: React.ReactNode }) => (
	<Callout type="tip" icon="💡">
		<strong>Conseil</strong>
		{children}
	</Callout>
)

export const Attention = ({ children }: { children: React.ReactNode }) => (
	<Callout type="caution" icon="⚠️">
		<strong>Attention</strong>
		{children}
	</Callout>
)

export const Info = ({ children }: { children: React.ReactNode }) => (
	<Callout type="important" icon="ℹ️">
		<strong>Information</strong>
		{children}
	</Callout>
)

export const Note = ({ children }: { children: React.ReactNode }) => (
	<Callout type="note" icon="📝">
		<strong>Note</strong>
		{children}
	</Callout>
)
