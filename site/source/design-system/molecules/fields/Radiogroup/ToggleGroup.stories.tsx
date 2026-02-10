import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { ToggleGroup, type ToggleOption } from './ToggleGroup'

export default {
	component: ToggleGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof ToggleGroup>

const TOGGLE_OPTIONS = [
	{
		value: 'option1',
		label: 'Option 1',
	},
	{
		value: 'option2',
		label: 'Option 2',
	},
	{
		value: 'option3',
		label: 'Option 3',
	},
]

const ToggleGroupToRender = (options: ToggleOption[], defaultValue: string) => {
	const [value, setValue] = useState(defaultValue)

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<ToggleGroup
			legend="Légende du groupe de boutons radio"
			options={options}
			value={value}
			onChange={handleChange}
		/>
	)
}

type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
	render: () => ToggleGroupToRender(TOGGLE_OPTIONS, TOGGLE_OPTIONS[0].value),
}
