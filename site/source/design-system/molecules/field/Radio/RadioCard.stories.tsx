import { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { RadioCard } from './RadioCard'
import { RadioCardGroup } from './RadioCardGroup'

export default {
	component: RadioCard,
	decorators: [
		(Story) => (
			<div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
				<Story />
			</div>
		),
	],
} as Meta<typeof RadioCard>

type Story = StoryObj<typeof RadioCard>

const DefaultExample = () => {
	const [selected, setSelected] = useState<string>('')

	return (
		<RadioCardGroup
			label="Choix avec cartes"
			aria-label="Choix avec cartes"
			value={selected}
			onChange={setSelected}
		>
			<RadioCard value="option1" label="Option 1" />
			<RadioCard value="option2" label="Option 2" />
			<RadioCard value="option3" label="Option 3" />
		</RadioCardGroup>
	)
}

export const Default: Story = {
	render: () => <DefaultExample />,
}

const WithDescriptionsExample = () => {
	const [selected, setSelected] = useState<string>('')

	return (
		<RadioCardGroup
			label="Choix avec descriptions"
			aria-label="Choix avec descriptions"
			value={selected}
			onChange={setSelected}
		>
			<RadioCard
				value="option1"
				label="Option 1"
				description="Description de l'option 1 qui explique en détail ce que fait cette option."
			/>
			<RadioCard
				value="option2"
				label="Option 2"
				description="Description de l'option 2 qui explique en détail ce que fait cette option."
			/>
			<RadioCard
				value="option3"
				label="Option 3"
				description="Description de l'option 3 qui explique en détail ce que fait cette option."
			/>
		</RadioCardGroup>
	)
}

export const WithDescriptions: Story = {
	render: () => <WithDescriptionsExample />,
}

const WithEmojisExample = () => {
	const [selected, setSelected] = useState<string>('')

	return (
		<RadioCardGroup
			label="Choix avec emojis"
			aria-label="Choix avec emojis"
			value={selected}
			onChange={setSelected}
		>
			<RadioCard
				value="option1"
				label="Option 1"
				emoji="✅"
				description="Option avec une coche verte"
			/>
			<RadioCard
				value="option2"
				label="Option 2"
				emoji="⚠️"
				description="Option avec un avertissement"
			/>
			<RadioCard
				value="option3"
				label="Option 3"
				emoji="🔄"
				description="Option avec un symbole de synchronisation"
			/>
		</RadioCardGroup>
	)
}

export const WithEmojis: Story = {
	render: () => <WithEmojisExample />,
}

const WithDefaultSelectionExample = () => {
	const [selected, setSelected] = useState<string>('option2')

	return (
		<RadioCardGroup
			label="Choix avec sélection par défaut"
			aria-label="Choix avec sélection par défaut"
			value={selected}
			onChange={setSelected}
		>
			<RadioCard
				value="option1"
				label="Option 1"
				description="Description de l'option 1"
			/>
			<RadioCard
				value="option2"
				label="Option 2"
				description="Description de l'option 2 (sélectionnée par défaut)"
			/>
			<RadioCard
				value="option3"
				label="Option 3"
				description="Description de l'option 3"
			/>
		</RadioCardGroup>
	)
}

export const WithDefaultSelection: Story = {
	render: () => <WithDefaultSelectionExample />,
}

const WithDisabledOptionExample = () => {
	const [selected, setSelected] = useState<string>('')

	return (
		<RadioCardGroup
			label="Choix avec option désactivée"
			aria-label="Choix avec option désactivée"
			value={selected}
			onChange={setSelected}
		>
			<RadioCard
				value="option1"
				label="Option 1"
				description="Description de l'option 1"
			/>
			<RadioCard
				value="option2"
				label="Option 2"
				description="Description de l'option 2 (désactivée)"
				isDisabled
			/>
			<RadioCard
				value="option3"
				label="Option 3"
				description="Description de l'option 3"
			/>
		</RadioCardGroup>
	)
}

export const WithDisabledOption: Story = {
	render: () => <WithDisabledOptionExample />,
}
