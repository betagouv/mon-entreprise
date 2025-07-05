/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Montant, montant } from '@/domaine/Montant'

import { InputSuggestions } from './InputSuggestions'

export default {
	title: 'Design System/Suggestions/InputSuggestions',
	component: InputSuggestions,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof InputSuggestions>

type Story<T = unknown> = StoryObj<typeof InputSuggestions<T>>

const InputSuggestionsWrapper = <T,>(
	args: React.ComponentProps<typeof InputSuggestions<T>>
) => {
	const [valeur, setValeur] = useState<string>('Aucune sélection')

	return (
		<div>
			<div style={{ marginBottom: '1rem' }}>
				<strong>Valeur sélectionnée :</strong> {valeur}
			</div>
			<InputSuggestions
				{...args}
				onFirstClick={(valeur) => {
					setValeur(JSON.stringify(valeur, null, 2))
					args.onFirstClick?.(valeur)
				}}
			/>
		</div>
	)
}

export const SuggestionsDeMontants: Story<Montant> = {
	render: (args) => <InputSuggestionsWrapper {...args} />,
	args: {
		suggestions: {
			'SMIC mensuel': montant(1709.28, '€'),
			'SMIC annuel': montant(20511.36, '€'),
			'Plafond Sécurité Sociale': montant(3666, '€'),
		},
	},
}

export const SuggestionsDeTexte: Story<{ valeur: string }> = {
	render: (args) => <InputSuggestionsWrapper {...args} />,
	args: {
		suggestions: {
			'Temps plein': { valeur: 'Temps plein' },
			'Temps partiel': { valeur: 'Temps partiel' },
			'Forfait jours': { valeur: 'Forfait jours' },
		},
	},
}

export const SuggestionsDeNombres: Story = {
	render: (args) => <InputSuggestionsWrapper {...args} />,
	args: {
		suggestions: {
			'20 heures par semaine': { valeur: 20 },
			'35 heures par semaine': { valeur: 35 },
			'39 heures par semaine': { valeur: 39 },
		},
	},
}

export const SansSuggestions: Story = {
	render: (args) => <InputSuggestionsWrapper {...args} />,
	args: {
		suggestions: {},
	},
}
