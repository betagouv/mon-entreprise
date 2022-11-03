import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Message } from '@/design-system'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Message,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: { type: 'string' },
	},
} as ComponentMeta<typeof Message>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Message> = (args) => <Message {...args} />

export const AccompanyingMessage = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
AccompanyingMessage.args = {
	children:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
	type: 'primary',
	icon: true,
	border: true,
}

const AlertTemplate: ComponentStory<typeof Message> = (args) => (
	<>
		<Message {...args} type="success">
			Votre message a bien été envoyé
		</Message>
		<Message {...args} type="info">
			Certaines informations sont incorrectes
		</Message>
		<Message {...args} type="error">
			Échec de l’envoi du message
		</Message>
	</>
)

export const Alert = AlertTemplate.bind({})
Alert.args = {
	children: 'Votre message a bien été envoyé',
	icon: true,
	border: true,
}
