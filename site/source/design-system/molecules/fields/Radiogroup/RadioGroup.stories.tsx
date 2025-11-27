import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RadioGroup } from './RadioGroup'

export default {
	title: 'Design System/molecules/fields/RadioGroup',
	component: RadioGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof RadioGroup>

const RADIO_OPTIONS = [
	{
		value: 'option1',
		label: 'Option 1 (avec description)',
		description: "Description de l'option 1",
	},
	{
		value: 'option2',
		label: 'Option 2 (sans)',
	},
	{
		value: 'option3',
		label: 'Option 3 (avec)',
		description: "Description de l'option 3",
	},
]
const DefaultRadioGroup = () => {
	const defaultValue = RADIO_OPTIONS[0].value

	const [value, setValue] = useState(defaultValue)

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioGroup
			defaultValue={defaultValue}
			legend="Légende du groupe de boutons radio"
			options={RADIO_OPTIONS}
			value={value}
			onChange={handleChange}
		/>
	)
}

const RadioGroupWithoutDefaultValue = () => {
	const [value, setValue] = useState('')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioGroup
			legend="Légende du groupe de boutons radio"
			options={RADIO_OPTIONS}
			value={value}
			onChange={handleChange}
		/>
	)
}

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
	args: {
		legend: 'Légende du radiogroup',
		options: RADIO_OPTIONS,
	},
	render: () => <DefaultRadioGroup />,
}

export const WithoutDefaultValue: Story = {
	args: {
		legend: 'Légende du radiogroup',
		options: RADIO_OPTIONS,
	},
	render: () => <RadioGroupWithoutDefaultValue />,
}
