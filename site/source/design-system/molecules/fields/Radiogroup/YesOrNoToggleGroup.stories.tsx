import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { OuiNon } from '@/domaine/OuiNon'

import { YesOrNoToggleGroup } from './YesOrNoToggleGroup'

export default {
	component: YesOrNoToggleGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof YesOrNoToggleGroup>

const YesOrNoToggleGroupToRender = (defaultValue?: OuiNon) => {
	const [value, setValue] = useState(defaultValue)

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString() as OuiNon)
	}

	return (
		<YesOrNoToggleGroup
			legend="Question attendant une réponse par oui ou par non"
			value={value}
			onChange={handleChange}
		/>
	)
}

type Story = StoryObj<typeof YesOrNoToggleGroup>

export const Default: Story = {
	render: () => YesOrNoToggleGroupToRender(),
}

export const WithDefaultValue: Story = {
	render: () => YesOrNoToggleGroupToRender('non'),
}
