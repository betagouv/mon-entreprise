import type { Meta, StoryObj } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'

import { Button, Li, Tag, Ul } from '@/design-system'
import i18n from '@/locales/i18n'

import { DesignSystemThemeProvider } from '../root'
import { StatusCard } from './StatusCard'

const meta: Meta<typeof StatusCard> = {
	component: StatusCard,
	decorators: [
		(Story) => (
			<I18nextProvider i18n={i18n}>
				<DesignSystemThemeProvider>
					<div style={{ maxWidth: '800px', padding: '1rem' }}>
						<Story />
					</div>
				</DesignSystemThemeProvider>
			</I18nextProvider>
		),
	],
	tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof StatusCard>

export const AvecTitre: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="tertiary">EI</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>1 084 €/mois</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				avec un taux plein
			</StatusCard.ValeurSecondaire>
		</StatusCard>
	),
}

export const MeilleureOption: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="success">SASU</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>2 503 €/mois</StatusCard.Titre>
		</StatusCard>
	),
}

export const AvecComplément: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="info">SASU</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>1 645 €/mois</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				Soit 1 676 € avant impôts
			</StatusCard.ValeurSecondaire>
			<StatusCard.Complément>
				<Ul>
					<Li>Avec 44 % de cotisations sociales sur le bénéfice</Li>
				</Ul>
			</StatusCard.Complément>
		</StatusCard>
	),
}

export const AvecActions: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="tertiary">EI</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>1 084 €/mois</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				avec un taux plein
			</StatusCard.ValeurSecondaire>
			<StatusCard.Action>
				<Button size="XS">Choisir ce statut</Button>
			</StatusCard.Action>
		</StatusCard>
	),
}

export const Complet: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="tertiary">AE</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>2 503 €/mois</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				Soit 2 503 € avant impôts
			</StatusCard.ValeurSecondaire>
			<StatusCard.Complément>
				<Ul>
					<Li>
						Avec 12 % de cotisations sociales sur le chiffre d'affaires (soit 17
						% du bénéfice)
					</Li>
				</Ul>
			</StatusCard.Complément>
			<StatusCard.Action>
				<Button size="XS">Voir le détail</Button>
			</StatusCard.Action>
		</StatusCard>
	),
}

export const PlusieursÉtiquettes: Story = {
	render: () => (
		<StatusCard>
			<StatusCard.Étiquette>
				<Tag color="info">SASU</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Étiquette>
				<Tag color="success">EURL</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>2 003 €/mois</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				Soit 2 087 € avant impôts
			</StatusCard.ValeurSecondaire>
		</StatusCard>
	),
}

export const OptionApplicable: Story = {
	render: () => (
		<StatusCard status="applicable">
			<StatusCard.Étiquette>
				<Tag color="tertiary">AE</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>Auto-entrepreneur</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>Applicable</StatusCard.ValeurSecondaire>
		</StatusCard>
	),
}

export const OptionSousConditions: Story = {
	render: () => (
		<StatusCard status="sousConditions">
			<StatusCard.Étiquette>
				<Tag color="tertiary">AE</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>Auto-entrepreneur</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				Indiquez le classement du logement pour savoir si ce régime est
				applicable
			</StatusCard.ValeurSecondaire>
		</StatusCard>
	),
}

export const OptionNonApplicable: Story = {
	render: () => (
		<StatusCard status="nonApplicable">
			<StatusCard.Étiquette>
				<Tag color="tertiary">AE</Tag>
			</StatusCard.Étiquette>
			<StatusCard.Titre>Auto-entrepreneur</StatusCard.Titre>
			<StatusCard.ValeurSecondaire>
				Non applicable avec vos recettes actuelles
			</StatusCard.ValeurSecondaire>
		</StatusCard>
	),
}
