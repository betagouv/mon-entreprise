import { Meta, StoryObj } from '@storybook/react'

import { CheckList as CheckListComponent } from '@/design-system'

const meta: Meta<typeof CheckListComponent> = {
	component: CheckListComponent,
	argTypes: {
		items: [{ isChecked: 'boolean', label: 'string' }],
	},
}

export default meta

type Story = StoryObj<typeof CheckListComponent>

export const CheckList: Story = {
	args: {
		items: [
			{ isChecked: false, label: "Tient compte de l'ACRE" },
			{
				isChecked: true,
				label: "Versement libératoire de l'impôt sur le revenu",
			},
		],
	},
}
