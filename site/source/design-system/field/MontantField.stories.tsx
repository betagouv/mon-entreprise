/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { montant, Montant, UnitéMonétaire } from '@/domaine/Montant'

import MontantField from '../conversation/MontantField'

export default {
	title: 'Design System/Field/MontantField',
	component: MontantField,
	parameters: {
		docs: {
			description: {
				component: `Le composant \`MontantField\` est prévu pour la saisie de montants.
Il est spécialement conçu pour gérer les unités monétaires du domaine. **Utilisez ce composant à la place de NumberField pour tous les montants en euros**.

Il offre des fonctionnalités spécifiques:
- Support du format avec ou sans centimes
- Intégration avec le modèle de domaine \`Montant\`
				`,
			},
		},
	},
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof MontantField>

type Story = StoryObj<typeof MontantField>

const MontantFieldWrapper = <U extends UnitéMonétaire>(
	args: React.ComponentProps<typeof MontantField<U>>
) => {
	const [value, setValue] = useState<Montant<U> | undefined>(args.value)

	return (
		<MontantField
			{...args}
			value={value}
			onChange={(newValue) => {
				setValue(newValue)
				args.onChange?.(newValue)
			}}
		/>
	)
}

export const Défaut: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
	},
}

export const AvecValeurInitiale: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
		value: montant(1500, 'Euro'),
	},
}

export const AvecCentimes: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
		value: montant(1234.56, 'Euro'),
		avecCentimes: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Version avec affichage des centimes (précision à 2 décimales)',
			},
		},
	},
}

export const AvecPlaceholder: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
		placeholder: montant(1500, 'Euro'),
	},
}

export const AvecSuggestions: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
		showSuggestions: true,
		suggestions: {
			'SMIC mensuel': montant(1709.28, 'Euro'),
			'SMIC annuel': montant(20511.36, 'Euro'),
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Possibilité d'ajouter des suggestions de montants prédéfinis, avec leur libellé.",
			},
		},
	},
}

export const AvecAttributsAccessibilité: Story = {
	render: (args) => <MontantFieldWrapper {...args} />,
	args: {
		unité: 'Euro',
		value: montant(1500, 'Euro'),
		id: 'montant-salaire',
		aria: {
			label: 'Montant du salaire brut',
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Exemple avec des attributs d'accessibilité pour améliorer l'expérience des technologies d'assistance.",
			},
		},
	},
}

export const DifférentesUnités: Story = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
			<MontantFieldWrapper
				unité="Euro"
				value={montant(1500, 'Euro')}
				aria={{ label: 'Montant en euros' }}
			/>
			<MontantFieldWrapper
				unité="EuroParMois"
				value={montant(1500, 'EuroParMois')}
				aria={{ label: 'Montant en euros par mois' }}
			/>
			<MontantFieldWrapper
				unité="EuroParAn"
				value={montant(30000, 'EuroParAn')}
				aria={{ label: 'Montant en euros par an' }}
			/>
			<MontantFieldWrapper
				unité="EuroParJour"
				value={montant(75, 'EuroParJour')}
				aria={{ label: 'Montant en euros par jour' }}
			/>
			<MontantFieldWrapper
				unité="EuroParHeure"
				value={montant(10.57, 'EuroParHeure')}
				avecCentimes={true}
				aria={{ label: 'Montant en euros par heure' }}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story:
					'MontantField supporte différentes unités monétaires du domaine.',
			},
		},
	},
}
