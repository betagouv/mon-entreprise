import { Decorator, Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { Li, SmallBody, Strong, Ul } from '../typography'
import { HelpButton } from './HelpButton'

const RouterDecorator: Decorator = (Story) => (
	<MemoryRouter>
		<Story />
	</MemoryRouter>
)

const meta = {
	component: HelpButton,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	decorators: [RouterDecorator],
} satisfies Meta<typeof HelpButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		description: 'Description détaillée dans la tooltip.',
	},
}

const Composant = () => (
	<div style={{ flexDirection: 'column' }}>
		<SmallBody style={{ color: 'white' }}>
			Texte dans la tooltip avec composants
		</SmallBody>
		<Ul>
			<Li>Point 1</Li>
			<Li>Point 2</Li>
			<Li>
				<Strong>Texte en balise strong</Strong>
			</Li>
		</Ul>
	</div>
)

export const WithComponents: Story = {
	args: {
		description: <Composant />,
	},
}
