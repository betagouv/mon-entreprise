import { Meta, StoryObj } from '@storybook/react'

import { CheckboxField } from './CheckboxField'

const CHECKBOX_OPTION = {
	value: 'checkbox-value',
	label: 'Label de la checkbox',
}

const CHECKBOX_OPTION_WITH_DESCRIPTION = {
	...CHECKBOX_OPTION,
	description: 'Description de la checkbox',
}

export default {
	title: 'Design System/molecules/fields/CheckboxField',
	component: CheckboxField,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof CheckboxField>

type Story = StoryObj<typeof CheckboxField>

export const Default: Story = {
	args: {
		option: CHECKBOX_OPTION,
	},
}

export const WithDescription: Story = {
	args: {
		option: CHECKBOX_OPTION_WITH_DESCRIPTION,
	},
}
