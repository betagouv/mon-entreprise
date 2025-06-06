import { Meta, StoryObj } from '@storybook/react'

import { SearchableSelectField } from './SearchableSelectField'

const meta: Meta<typeof SearchableSelectField> = {
	component: SearchableSelectField,
}

export default meta

type Story = StoryObj<typeof SearchableSelectField>

export const Basic: Story = {
	render: () => (
		<SearchableSelectField
			selectedValue={<div>une réponse</div>}
		></SearchableSelectField>
	),
	args: {},
}
