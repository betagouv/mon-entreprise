import { action } from '@storybook/addon-actions'
import { Meta, StoryObj } from '@storybook/react'

import { Spacing } from '../../layout'
import { DateField } from './DateField'

export default {
	component: DateField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
				<Spacing md />
			</div>
		),
	],
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['date', 'date passé', 'date futur'],
			defaultValue: 'date',
		},
		label: {
			control: 'text',
			defaultValue: 'Date de naissance',
		},
		onChange: { action: 'date changed' },
	},
	args: {
		onChange: action('date changed'),
	},
} as Meta<typeof DateField>

type Story = StoryObj<typeof DateField>

export const Default: Story = {
	args: {
		label: 'Date de naissance',
	},
}

export const DatePassee: Story = {
	args: {
		type: 'date passé',
		label: 'Date dans le passé',
	},
}

export const DateFuture: Story = {
	args: {
		type: 'date futur',
		label: 'Date dans le futur',
	},
}

export const WithInitialValue: Story = {
	args: {
		defaultSelected: new Date('2000-01-01'),
		label: 'Avec valeur initiale',
	},
}
