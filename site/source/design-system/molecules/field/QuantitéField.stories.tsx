/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { quantité, Quantité } from '@/domaine/Quantité'

import { QuantitéField } from './QuantitéField'

export default {
	title: 'Design System/Field/QuantitéField',
	component: QuantitéField,
	parameters: {
		docs: {
			description: {
				component: `Le composant \`QuantitéField\` est prévu pour la saisie de quantités avec une unité (non monétaire).
Il est spécialement conçu pour gérer les unités non monétaires du domaine. **Utilisez ce composant à la place de NumberField pour tous les quantités avec unité non monétaire**.

Il offre des fonctionnalités spécifiques:
- Support de pourcentage
- Support du format avec ou sans décimales
- Intégration avec le modèle de domaine \`Quantité\`
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
} as Meta<typeof QuantitéField>

type Story = StoryObj<typeof QuantitéField>

const QuantitéFieldWrapper = <U extends string>(
	args: React.ComponentProps<typeof QuantitéField<U>>
) => {
	const [value, setValue] = useState<Quantité<U> | undefined>(args.value)

	return (
		<QuantitéField
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
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
	},
}

export const AvecValeurInitiale: Story = {
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
		value: quantité(42, 'heures/mois'),
	},
}

export const SansDécimales: Story = {
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
		value: quantité(17.33, 'heures/mois'),
		nbDécimalesMax: 0,
	},
	parameters: {
		docs: {
			description: {
				story: 'Version sans décimales (arrondi à l’unité)',
			},
		},
	},
}

export const AvecPlaceholder: Story = {
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
		placeholder: quantité(42, 'heures/mois'),
	},
}

export const AvecSuggestions: Story = {
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
		suggestions: {
			'39h / semaine': quantité(17.33, 'heures/mois'),
			'42h / semaine': quantité(30.33, 'heures/mois'),
		},
	},
	parameters: {
		docs: {
			description: {
				story:
					"Possibilité d'ajouter des suggestions de quantités prédéfinis, avec leur libellé.",
			},
		},
	},
}

export const AvecAttributsAccessibilité: Story = {
	render: (args) => <QuantitéFieldWrapper {...args} />,
	args: {
		unité: 'heures/mois',
		value: quantité(17.33, 'heures/mois'),
		id: 'heures-sup',
		aria: {
			label: 'Heures supplémentaires',
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
			<QuantitéFieldWrapper
				unité="%"
				value={quantité(42, '%')}
				aria={{ label: 'Pourcentage' }}
			/>
			<QuantitéFieldWrapper
				unité="heures/mois"
				value={quantité(18, 'heures/mois')}
				aria={{ label: 'Nombre d’heures par mois' }}
			/>
			<QuantitéFieldWrapper
				unité="jours"
				value={quantité(7, 'jours')}
				aria={{ label: 'Nombre de jours' }}
			/>
			<QuantitéFieldWrapper
				unité="jours ouvrés"
				value={quantité(5, 'jours ouvrés')}
				aria={{ label: 'Nombre de jours ouvrés' }}
			/>
			<QuantitéFieldWrapper
				unité="mois"
				value={quantité(12, 'mois')}
				aria={{ label: 'Nombre de mois' }}
			/>
			<QuantitéFieldWrapper
				unité="trimestre civil"
				value={quantité(12, 'trimestre civil')}
				aria={{ label: 'Nombre de trimestres civils' }}
			/>
			<QuantitéFieldWrapper
				unité="année civile"
				value={quantité(12, 'année civile')}
				aria={{ label: 'Nombre d’années civiles' }}
			/>
			<QuantitéFieldWrapper
				unité="employés"
				value={quantité(12, 'employés')}
				aria={{ label: 'Nombre d’employés' }}
			/>
		</div>
	),
	parameters: {
		docs: {
			description: {
				story: 'QuantitéField supporte différentes unités du domaine.',
			},
		},
	},
}
