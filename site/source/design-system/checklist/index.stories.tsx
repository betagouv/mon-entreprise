import { ComponentMeta, ComponentStory } from '@storybook/react'

import { CheckList } from '@/design-system'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: CheckList,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
	argTypes: {
		items: [{ isChecked: 'boolean', label: 'string' }],
	},
} as ComponentMeta<typeof CheckList>

export const CheckListWithData: ComponentStory<typeof CheckList> = () => (
	<CheckList
		items={[
			{ isChecked: false, label: "Tient compte de l'ACRE" },
			{
				isChecked: true,
				label: "Versement libératoire de l'impôt sur le revenu",
			},
		]}
	/>
)
