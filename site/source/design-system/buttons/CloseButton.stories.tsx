import { Meta, StoryObj } from '@storybook/react'

import { CloseButton as CloseButtonComponent } from './index'

const meta: Meta<typeof CloseButtonComponent> = {
	component: CloseButtonComponent,
}

export default meta

type Story = StoryObj<typeof CloseButtonComponent>

export const CloseButton: Story = {}
