/* eslint-disable react/jsx-props-no-spreading */
import { Meta, StoryObj } from '@storybook/react'

import { TextField } from './TextField'

export default {
	title: 'Design System/molecules/fields/TextField',
	component: TextField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof TextField>

type Story = StoryObj<typeof TextField>

export const Default: Story = {
	args: {
		label: 'Label du champ',
	},
}

export const WithInitialValue: Story = {
	args: {
		label: 'Label du champ',
		defaultValue: 'Valeur par défaut',
	},
}

export const WithPlaceholder: Story = {
	args: {
		label: 'Adresse email (au format "mon-adresse@example.com")',
		placeholder: 'Votre adresse email',
	},
}

export const WithDescription: Story = {
	args: {
		label: 'Mot de passe',
		description: '8 caractères minimum',
	},
}

export const WithErrorMessage: Story = {
	args: {
		label: 'Mot de passe',
		errorMessage: 'Le mot de passe doit contenir 8 caractères minimum',
	},
}
