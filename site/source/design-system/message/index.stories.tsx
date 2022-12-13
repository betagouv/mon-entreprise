import { ComponentMeta, ComponentStory } from '@storybook/react'
import styled from 'styled-components'

import { Message } from '@/design-system'

import { Strong } from '../typography'
import { Body } from '../typography/paragraphs'

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
	icon: true,
}

export const MessageWithCustomIcon = () => (
	<Message type="info" icon="🚧" border={false} mini>
		<Body>
			<StyledStrong>Cet outil est en version bêta</StyledStrong> : nous
			travaillons à <Strong>valider les informations et les calculs</Strong>,
			mais des <Strong>erreurs peuvent être présentes.</Strong>
		</Body>
	</Message>
)

const StyledStrong = styled(Strong)`
	color: ${({ theme }) => theme.colors.extended.info[600]};
`
