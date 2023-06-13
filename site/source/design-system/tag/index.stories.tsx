import { Meta, StoryObj } from '@storybook/react'

import { Tag } from '.'
import { HexagonIcon } from '../icons'
import theme from '../theme'

const meta: Meta<typeof Tag> = {
	component: Tag,
}

export default meta

type Story = StoryObj<typeof Tag>

export const Basic: Story = {
	render: (args) => (
		<>
			<Tag {...args}>No props</Tag>
			<Tag sm>Small</Tag>
			<Tag color="primary" md>
				Medium primary color
			</Tag>
			<Tag color="red">Large red</Tag>

			<Tag color="secondary" md>
				With icon <HexagonIcon />
			</Tag>
			<p>
				Medium Tag with primary color in light mode and secondary color in dark
				mode :
			</p>
			<Tag color={{ light: 'primary', dark: 'secondary' }} md>
				Example
			</Tag>
			<p>Medium Tag with custom color in light and dark mode :</p>
			<Tag
				color={{
					light: theme.colors.bases.secondary[400],
					dark: theme.colors.bases.tertiary[600],
				}}
				md
			>
				Custom color
			</Tag>
		</>
	),
	args: {},
}
