import { Accordion } from '@/design-system'
import { Body } from '@/design-system/typography/paragraphs'
import { Item } from '@react-stately/collections'
import { ComponentMeta, ComponentStory } from '@storybook/react'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Accordion,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Accordion>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Accordion> = (args) => (
	<Accordion {...args}>
		<Item key="lorem-ipsum" title="Lorem ipsum" hasChildItems={false}>
			<Body>
				Nam ipsum doloribus non. Deserunt consequatur quam consectetur odio.
				Dolor eos est et omnis quas nulla repellat. Velit voluptate sequi et
				voluptatibus sed dolorem dolorum.
			</Body>
			<Body>
				Totam et reprehenderit aliquam hic dolorum ipsum. Iste et neque eos
				voluptas deserunt harum. Mollitia numquam incidunt nihil laboriosam.
				Error autem possimus quaerat veniam ut explicabo ut. Error esse est
				reprehenderit quae dolor occaecati quas laboriosam.
			</Body>
		</Item>
		<Item
			key="eligendi-et-voluptatem"
			title="Eligendi et voluptatem"
			hasChildItems={false}
		>
			<Body>
				Qui tempora tenetur eum voluptatibus sit et assumenda fuga. Temporibus
				hic ut in maxime omnis esse et nam. Aliquam veritatis perferendis quia
				enim dolorem molestiae. Impedit eaque optio iste. Eligendi et voluptatem
				voluptate corporis perferendis.
			</Body>
		</Item>
	</Accordion>
)

export const Basic = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Basic.args = {
	defaultExpandedKeys: ['lorem-ipsum'],
}
