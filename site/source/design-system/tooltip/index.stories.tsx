import { ErrorBoundary } from '@sentry/react'
import { Meta, StoryObj } from '@storybook/react'

import { Tooltip } from '@/design-system/tooltip'

const meta: Meta<typeof Tooltip> = {
	component: Tooltip,
	argTypes: {
		tooltip: {
			type: 'string',
		},
		id: {
			type: 'string',
		},
	},
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
	args: {
		children: <span>Passez la souris sur moi</span>,
		tooltip: 'Coucou !',
		id: 'test-tooltip',
	},
}

export const Invalid: Story = {
	render: (args) => (
		<ErrorBoundary fallback={({ error }) => <span>{error.message}</span>}>
			<Tooltip {...args} />
		</ErrorBoundary>
	),
	args: {
		children: <>Les Fragment sont interdit</>,
		tooltip: 'Coucou !',
		id: 'test-tooltip',
	},
}
