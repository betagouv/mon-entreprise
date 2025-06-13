import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import SelectChoiceGroup from './SelectChoiceGroup'

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
	title: 'Design System/Field/ChoiceGroup/SelectChoiceGroup',
	component: SelectChoiceGroup,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
	tags: ['autodocs'],
} satisfies Meta<typeof SelectChoiceGroup>

export default meta
type Story = StoryObj<typeof meta>

const SelectExample = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<SelectChoiceGroup
			options={options}
			title="Sélection en mode select"
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
	render: () => <SelectExample />,
}
