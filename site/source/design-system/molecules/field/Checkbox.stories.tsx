/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { Checkbox } from './Checkbox'

export default {
	component: Checkbox,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof Checkbox>

type Story = StoryObj<typeof Checkbox>

const CheckboxWrapper = (args: React.ComponentProps<typeof Checkbox>) => {
	const [isSelected, setIsSelected] = useState<boolean>(!!args.defaultSelected)

	return <Checkbox {...args} isSelected={isSelected} onChange={setIsSelected} />
}

export const Default: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		label: "J'accepte les conditions générales d'utilisation",
	},
}

export const WithAriaLabelledBy: Story = {
	render: (args) => (
		<>
			<p id="checkbox-label">Accepter les conditions générales d'utilisation</p>
			<CheckboxWrapper {...args} />
		</>
	),
	args: {
		'aria-labelledby': 'checkbox-label',
	},
}

export const WithInitialSelectionTrue: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		label: 'Option activée par défaut',
		defaultSelected: true,
	},
}

export const WithInitialSelectionFalse: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		label: 'Option désactivée par défaut',
		defaultSelected: false,
	},
}

export const Disabled: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		label: 'Option désactivée',
		isDisabled: true,
	},
}

export const WithChildren: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		children: 'Option avec enfants comme label',
	},
}

export const WithLongLabel: Story = {
	render: (args) => <CheckboxWrapper {...args} />,
	args: {
		label:
			"Une option avec un label très long qui va probablement s'étendre sur plusieurs lignes pour tester comment le composant gère l'alignement vertical et le wrapping du texte",
	},
}
