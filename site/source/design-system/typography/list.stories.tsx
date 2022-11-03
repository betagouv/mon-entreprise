import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Li, Ol, Ul } from '@/design-system/typography/list'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Ul,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Ul>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Ul> = (args) => (
	<Ul {...args}>
		<Li>Élément 1</Li>
		<Li>Élément 2</Li>
		<Li>Élément 3</Li>
	</Ul>
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {}

export const XL = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
XL.args = {
	size: 'XL',
}

const OlTemplate: ComponentStory<typeof Ol> = (args) => (
	<Ol {...args}>
		<Li>Élément 1</Li>
		<Li>Élément 2</Li>
		<Li>Élément 3</Li>
	</Ol>
)

export const Numbered = OlTemplate.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Numbered.args = {}
