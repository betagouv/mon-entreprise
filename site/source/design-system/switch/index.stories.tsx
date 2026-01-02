/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Switch } from './'

const meta: Meta<typeof Switch> = {
	component: Switch,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component:
					"Le composant Switch permet à l'utilisateur d'activer ou de désactiver une option.",
			},
		},
	},
	argTypes: {
		children: {
			control: 'text',
			description: 'Le label du switch',
		},
		isSelected: {
			control: 'boolean',
			description: 'Si le switch est activé ou non',
		},
		defaultSelected: {
			control: 'boolean',
			description: 'La valeur sélectionnée par défaut',
		},
		isDisabled: {
			control: 'boolean',
			description: 'Si le switch est désactivé',
		},
		onChange: {
			action: 'changed',
			description: "Fonction appelée lorsque l'état change",
		},
		light: {
			control: 'boolean',
			description: 'Utiliser un style plus léger',
		},
		size: {
			control: 'select',
			options: ['XS', 'MD', 'XL'],
			description: 'Taille du switch',
		},
	},
}

export default meta

type Story = StoryObj<typeof Switch>

export const Basic: Story = {
	args: {
		children: 'Option activable',
		defaultSelected: false,
	},
}

const ControlledSwitch = (args: React.ComponentProps<typeof Switch>) => {
	const [isSelected, setIsSelected] = useState(false)

	return (
		<Switch {...args} isSelected={isSelected} onChange={setIsSelected}>
			{args.children ||
				'Option contrôlée: ' + (isSelected ? 'Activée' : 'Désactivée')}
		</Switch>
	)
}

export const Controlled: Story = {
	render: (args) => <ControlledSwitch {...args} />,
}

export const Selected: Story = {
	args: {
		children: 'Option activée',
		defaultSelected: true,
	},
}

export const WithInvertedLabel: Story = {
	args: {
		children: 'Label après le switch',
	},
}

export const Disabled: Story = {
	args: {
		children: 'Option désactivée',
		isDisabled: true,
	},
}

// Composant nommé pour l'histoire Sizes
const SizeVariants = () => (
	<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
		<Switch size="XS">Petite taille (XS)</Switch>
		<Switch size="MD">Taille moyenne (MD)</Switch>
		<Switch size="XL">Grande taille (XL)</Switch>
	</div>
)

export const Sizes: Story = {
	render: () => <SizeVariants />,
}

export const Light: Story = {
	args: {
		children: 'Style léger',
		light: true,
	},
}
