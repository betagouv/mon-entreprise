import { Meta, StoryObj } from '@storybook/react'

import { Body } from '../typography/paragraphs'
import { Message } from './'

const meta: Meta<typeof Message> = {
	component: Message,
	argTypes: {
		children: { type: 'string' },
	},
}

export default meta

type Story = StoryObj<typeof Message>

export const AccompanyingMessage: Story = {
	args: {
		children: (
			<Body>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam
			</Body>
		),
		type: 'primary',
		icon: true,
	},
}

export const Alert: Story = {
	render: (args) => (
		<>
			<Message {...args} type="success">
				<Body>Votre message a bien été envoyé</Body>
			</Message>
			<Message {...args} type="info">
				<Body>Certaines informations sont incorrectes</Body>
			</Message>
			<Message {...args} type="error">
				<Body>Échec de l’envoi du message</Body>
			</Message>
		</>
	),
	args: { icon: true },
}
