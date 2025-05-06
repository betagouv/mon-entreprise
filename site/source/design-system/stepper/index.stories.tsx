import { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import { Step, Stepper } from '@/design-system'

const meta: Meta<typeof Stepper> = {
	component: Stepper,
}

export default meta

type Story = StoryObj<typeof Stepper>

export const Basic: Story = {
	render: (args) => (
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
	),
	args: {
		'aria-label': 'Étapes du formulaire en cours',
	},
}
