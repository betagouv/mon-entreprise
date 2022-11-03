import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { Step, Stepper } from '@/design-system'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
	component: Stepper,
	// More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Step>

const Template: ComponentStory<typeof Stepper> = (args) => (
	<MemoryRouter initialEntries={['/step-2']}>
		<Stepper {...args}>
			<Step to={'/'} progress={1}>
				Première étape
			</Step>
			<Step to={'/step-2'} progress={0.2}>
				Deuxième étape
			</Step>
			<Step to={'/step-3'} progress={0}>
				Troisième étape
			</Step>
			<Step to={'/step-4'} progress={0} isDisabled>
				Dernière étape
			</Step>
		</Stepper>
	</MemoryRouter>
)

export const Basic = Template.bind({})
Basic.args = {
	'aria-label': 'Étapes du formulaire en cours',
}
