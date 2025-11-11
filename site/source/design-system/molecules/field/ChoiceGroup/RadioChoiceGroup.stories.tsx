import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import RadioChoiceGroup from './RadioChoiceGroup'

const options = [
	{
		key: 'option1',
		value: 'option1',
		label: 'Option 1',
		description: "Description de l'option 1",
	},
	{
		key: 'option2',
		value: 'option2',
		label: 'Option 2',
		description: "Description de l'option 2",
	},
	{
		key: 'option3',
		value: 'option3',
		label: 'Option 3',
		description: "Description de l'option 3",
	},
]

const optionsWithSubOptions = [
	options[0],
	{
		label: 'Option 2',
		description: "Description de l'option 2",
		children: [
			{
				key: 'suboption1',
				value: 'suboption1',
				label: 'Sous Option 1',
				description: 'Description de la sous-option 1',
			},
			{
				key: 'suboption2',
				value: 'suboption2',
				label: 'Sous Option 2',
				description: 'Description de la sous-option 2',
			},
		],
	},
	options[2],
]

const optionsWithDisabled = [
	options[0],
	options[1],
	{
		...options[2],
		isDisabled: true,
	},
]

const meta = {
	title: 'Design System/Field/ChoiceGroup/RadioChoiceGroup',
	component: RadioChoiceGroup,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
	tags: ['autodocs'],
} satisfies Meta<typeof RadioChoiceGroup>

export default meta
type Story = StoryObj<typeof meta>

const RadioExample = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioChoiceGroup
			options={options}
			defaultValue="option1"
			value={value}
			onChange={handleChange}
		/>
	)
}

const WithDisabledOption = () => {
	const [value, setValue] = React.useState('')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioChoiceGroup
			options={optionsWithDisabled}
			value={value}
			onChange={handleChange}
		/>
	)
}

const ExampleWithSubOptions = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioChoiceGroup
			options={optionsWithSubOptions}
			defaultValue="option1"
			value={value}
			onChange={handleChange}
		/>
	)
}

export const Default: Story = {
	args: {
		options,
		onChange: (value) => console.log('onChange', value),
		value: 'option1',
	},
	render: () => <RadioExample />,
}

export const WithDisabled: Story = {
	args: {
		options: optionsWithDisabled,
		onChange: (value) => console.log('onChange', value),
	},
	render: () => <WithDisabledOption />,
}

export const WithSubOptions: Story = {
	args: {
		options: optionsWithSubOptions,
		onChange: (value) => console.log('onChange', value),
	},
	render: () => <ExampleWithSubOptions />,
}
