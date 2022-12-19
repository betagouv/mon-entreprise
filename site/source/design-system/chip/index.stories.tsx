import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Chip } from '@/design-system'

import { Emoji } from '../emoji'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Chip,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		children: { type: 'string' },
	},
} as ComponentMeta<typeof Chip>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Chip> = (args) => <Chip {...args} />

export const Notification = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Notification.args = {
	children: '4',
	type: 'info',
}

export const DifferentChips: ComponentStory<typeof Chip> = (args) => (
	<>
		<Chip {...args} type="error">
			Panique !
		</Chip>
		<Chip {...args} type="info">
			Attention
		</Chip>
		<Chip {...args} type="success">
			Ouiiiiiii
		</Chip>
		<Chip {...args} type="primary">
			4 messages non lus
		</Chip>
		<Chip {...args} type="secondary">
			SASU
		</Chip>
	</>
)

DifferentChips.args = {
	icon: true,
}

export const ChipWithCustomIcon: ComponentStory<typeof Chip> = (args) => (
	<>
		<Chip {...args} icon={<Emoji emoji="🚧" />} type="info">
			Bêta
		</Chip>
		<Chip {...args} type="secondary" icon={<Emoji emoji="😃" />}>
			Everything is awesome
		</Chip>
	</>
)

ChipWithCustomIcon.args = {}
