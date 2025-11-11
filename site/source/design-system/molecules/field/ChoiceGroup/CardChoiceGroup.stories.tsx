import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import CardChoiceGroup from './CardChoiceGroup'

const options = [
	{
		key: 'option1',
		value: 'option1',
		label: 'Option 1',
		description: "Description détaillée de l'option 1",
		emoji: '🔵',
	},
	{
		key: 'option2',
		value: 'option2',
		label: 'Option 2',
		description: "Description détaillée de l'option 2",
		emoji: '🟢',
	},
	{
		key: 'option3',
		value: 'option3',
		label: 'Option 3',
		description: "Description détaillée de l'option 3",
		emoji: '🟣',
	},
]

const businessOptions = [
	{
		key: 'entreprise-individuelle',
		value: 'entreprise-individuelle',
		label: 'Entreprise individuelle',
		description:
			"Forme juridique sans capital social, où l'entrepreneur et l'entreprise ne font qu'un",
		emoji: '👤',
	},
	{
		key: 'eurl',
		value: 'eurl',
		label: 'EURL',
		description:
			'Entreprise Unipersonnelle à Responsabilité Limitée, avec un seul associé',
		emoji: '🏛️',
	},
	{
		key: 'sasu',
		value: 'sasu',
		label: 'SASU',
		description:
			'Société par Actions Simplifiée Unipersonnelle, avec un seul actionnaire',
		emoji: '🏢',
	},
]

const optionsWithSubOptions = [
	options[0],
	{
		label: 'Option 2',
		description: "Description détaillée de l'option 2",
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

const meta = {
	title: 'Design System/Field/ChoiceGroup/CardChoiceGroup',
	component: CardChoiceGroup,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
	tags: ['autodocs'],
} satisfies Meta<typeof CardChoiceGroup>

export default meta
type Story = StoryObj<typeof meta>

const CardExample = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<CardChoiceGroup
			options={options}
			title="Sélection en mode card"
			defaultValue="option1"
			value={value}
			onChange={handleChange}
		/>
	)
}

const BusinessExample = () => {
	const [value, setValue] = React.useState('')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<CardChoiceGroup
			options={businessOptions}
			title="Choisissez votre statut juridique"
			value={value}
			onChange={handleChange}
		/>
	)
}

const CardExampleWithSubOptions = () => {
	const [value, setValue] = React.useState('option1')

	const handleChange = (newValue: React.Key) => {
		setValue(newValue.toString())
	}

	return (
		<CardChoiceGroup
			options={optionsWithSubOptions}
			title="Sélection en mode card"
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
	render: () => <CardExample />,
}

export const Business: Story = {
	args: {
		options: [],
		onChange: () => {},
	},
	render: () => <BusinessExample />,
}

export const WithSubOptions: Story = {
	args: {
		options: [],
		onChange: () => {},
	},
	render: () => <CardExampleWithSubOptions />,
}
