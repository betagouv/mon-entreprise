import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import SearchChoiceGroup from './SearchChoiceGroup'

const options = [
	{
		key: 'fonderie',
		value: 'fonderie',
		label: 'Fonderie des métaux légers ou non ferreux.',
		description: 'INDUSTRIES DE LA MÉTALLURGIE',
		detail: '6,23 %',
	},
	{
		key: 'restaurants',
		value: 'restaurants',
		label: 'Restaurants, café-tabac, hôtels avec ou sans restaurant et foyers.',
		description: "SERVICES, COMMERCES ET INDUSTRIES DE L'ALIMENTATION",
		detail: '1,78 %',
	},
	{
		key: 'coiffure',
		value: 'coiffure',
		label: 'Coiffure. Fabrication de postiches. Esthétique corporelle.',
		description: 'ACTIVITÉS DE SERVICES II',
		detail: '1,96 %',
	},
]

const meta = {
	component: SearchChoiceGroup,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
	tags: ['autodocs'],
} satisfies Meta<typeof SearchChoiceGroup>

export default meta
type Story = StoryObj<typeof meta>

const SearchExample = () => {
	const [value, setValue] = React.useState<string>()

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<SearchChoiceGroup
			options={options}
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
	render: () => <SearchExample />,
}
