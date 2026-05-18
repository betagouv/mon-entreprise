import { Meta, StoryObj } from '@storybook/react'

import { Emoji } from '../emoji'
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

export const Types: Story = {
	render: () => (
		<>
			<Message type="primary">
				<Body>Message de type 'primary'</Body>
			</Message>
			<Message type="secondary">
				<Body>Message de type 'secondary'</Body>
			</Message>
			<Message type="success">
				<Body>Message de type 'success'</Body>
			</Message>
			<Message type="info">
				<Body>Message de type 'info'</Body>
			</Message>
			<Message type="error">
				<Body>Message de type 'error'</Body>
			</Message>
		</>
	),
}

export const Mini: Story = {
	render: () => (
		<>
			<Message type="primary" mini>
				<Body>Message mini de type 'primary'</Body>
			</Message>
			<Message type="secondary" mini>
				<Body>Message mini de type 'secondary'</Body>
			</Message>
			<Message type="success" mini>
				<Body>Message mini de type 'success'</Body>
			</Message>
			<Message type="info" mini>
				<Body>Message mini de type 'info'</Body>
			</Message>
			<Message type="error" mini>
				<Body>Message mini de type 'error'</Body>
			</Message>
		</>
	),
}

export const Light: Story = {
	render: () => (
		<>
			<Message type="primary" light>
				<Body>Message light de type 'primary'</Body>
			</Message>
			<Message type="secondary" light>
				<Body>Message light de type 'secondary'</Body>
			</Message>
			<Message type="success" light>
				<Body>Message light de type 'success'</Body>
			</Message>
			<Message type="info" light>
				<Body>Message light de type 'info'</Body>
			</Message>
			<Message type="error" light>
				<Body>Message light de type 'error'</Body>
			</Message>
		</>
	),
}

export const SansBordures: Story = {
	render: () => (
		<>
			<Message type="primary" border={false}>
				<Body>Message sans bordures de type 'primary'</Body>
			</Message>
			<Message type="secondary" border={false}>
				<Body>Message sans bordures de type 'secondary'</Body>
			</Message>
			<Message type="success" border={false}>
				<Body>Message sans bordures de type 'success'</Body>
			</Message>
			<Message type="info" border={false}>
				<Body>Message sans bordures de type 'info'</Body>
			</Message>
			<Message type="error" border={false}>
				<Body>Message sans bordures de type 'error'</Body>
			</Message>
		</>
	),
}

export const MiniSansBordures: Story = {
	render: () => (
		<>
			<Message type="primary" mini border={false}>
				<Body>Message mini sans bordures de type 'primary'</Body>
			</Message>
			<Message type="secondary" mini border={false}>
				<Body>Message mini sans bordures de type 'secondary'</Body>
			</Message>
			<Message type="success" mini border={false}>
				<Body>Message mini sans bordures de type 'success'</Body>
			</Message>
			<Message type="info" mini border={false}>
				<Body>Message mini sans bordures de type 'info'</Body>
			</Message>
			<Message type="error" mini border={false}>
				<Body>Message mini sans bordures de type 'error'</Body>
			</Message>
		</>
	),
}

export const Dismissibles: Story = {
	render: () => (
		<>
			<Message type="primary" dismissible>
				<Body>Message dismissible de type 'primary'</Body>
			</Message>
			<Message type="secondary" dismissible>
				<Body>Message dismissible de type 'secondary'</Body>
			</Message>
			<Message type="success" dismissible>
				<Body>Message dismissible de type 'success'</Body>
			</Message>
			<Message type="info" dismissible>
				<Body>Message dismissible de type 'info'</Body>
			</Message>
			<Message type="error" dismissible>
				<Body>Message dismissible de type 'error'</Body>
			</Message>
		</>
	),
}

export const Icones: Story = {
	render: () => (
		<>
			<Message type="primary" icon>
				<Body>Message de type 'primary' avec icône par défaut</Body>
			</Message>
			<Message type="secondary" icon>
				<Body>Message de type 'secondary' avec icône par défaut</Body>
			</Message>
			<Message type="success" icon>
				<Body>Message de type 'success' avec icône par défaut</Body>
			</Message>
			<Message type="info" icon>
				<Body>Message de type 'info' avec icône par défaut</Body>
			</Message>
			<Message type="error" icon>
				<Body>Message de type 'error' avec icône par défaut</Body>
			</Message>
		</>
	),
}

export const IconesPersonnalisées: Story = {
	render: () => (
		<Message type="info" icon={<Emoji emoji="🚧" />}>
			<Body>Message avec icône personnalisée</Body>
		</Message>
	),
}
