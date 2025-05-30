import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import ToggleChoiceGroup from './ToggleChoiceGroup'

const options = [
	{
		key: 'option1',
		value: 'option1',
		label: 'Option 1',
	},
	{
		key: 'option2',
		value: 'option2',
		label: 'Option 2',
	},
	{
		key: 'option3',
		value: 'option3',
		label: 'Option 3',
	},
]

const meta = {
	title: 'Design System/Field/ChoiceGroup/ToggleChoiceGroup',
	component: ToggleChoiceGroup,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ToggleChoiceGroup>

export default meta
type Story = StoryObj<typeof meta>

const ToggleExample = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<ToggleChoiceGroup
			options={options}
			title="Sélection en mode toggle"
			defaultValue="option1"
			value={value}
			onChange={handleChange}
		/>
	)
}

export const Default: Story = {
	args: {
		options: [],
		onChange: () => {},
	},
	render: () => <ToggleExample />,
}
