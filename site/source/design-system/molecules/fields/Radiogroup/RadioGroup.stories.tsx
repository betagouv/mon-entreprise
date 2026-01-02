import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RadioGroup, type RadioOption } from './RadioGroup'

export default {
	component: RadioGroup,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof RadioGroup>

const RADIO_OPTIONS_WITHOUT_DESCRIPTION = [
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

const RADIO_OPTIONS_WITH_DESCRIPTIONS = [
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

const RadioGroupToRender = (options: RadioOption[], defaultValue: string) => {
	const [value, setValue] = useState(defaultValue)

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<RadioGroup
			legend="Légende du groupe de boutons radio"
			options={options}
			value={value}
			onChange={handleChange}
		/>
	)
}

type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
	render: () =>
		RadioGroupToRender(
			RADIO_OPTIONS_WITHOUT_DESCRIPTION,
			RADIO_OPTIONS_WITHOUT_DESCRIPTION[0].value
		),
}

export const WithDescriptions: Story = {
	render: () =>
		RadioGroupToRender(
			RADIO_OPTIONS_WITH_DESCRIPTIONS,
			RADIO_OPTIONS_WITH_DESCRIPTIONS[0].value
		),
}

export const WithoutDefaultValue: Story = {
	render: () => RadioGroupToRender(RADIO_OPTIONS_WITH_DESCRIPTIONS, ''),
}
