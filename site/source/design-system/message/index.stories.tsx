import { Meta, StoryObj } from '@storybook/react'
import styled from 'styled-components'

import { Message } from '@/design-system'

import { Emoji } from '../emoji'
import { Strong } from '../typography'
import { Body } from '../typography/paragraphs'

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

export const MessageWithCustomIcon: Story = {
	render: (args) => (
		<Message {...args}>
			<Body>
				<StyledStrong>Cet outil est en version bêta</StyledStrong> : nous
				travaillons à <Strong>valider les informations et les calculs</Strong>,
				mais des <Strong>erreurs peuvent être présentes.</Strong>
			</Body>
		</Message>
	),
	args: {
		type: 'info',
		icon: <Emoji emoji="🚧" />,
		border: false,
		mini: true,
	},
}

const StyledStrong = styled(Strong)`
	color: ${({ theme }) => theme.colors.extended.info[600]};
`
