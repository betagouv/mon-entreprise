import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Emoji as EmojiComponent } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: EmojiComponent,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		emoji: { type: 'string' },
	},
} as ComponentMeta<typeof EmojiComponent>

export const Emoji: ComponentStory<typeof EmojiComponent> = (args) => (
	<EmojiComponent {...args} />
)

Emoji.args = {
	emoji: '❤️🧡💛💚💙💜',
}
