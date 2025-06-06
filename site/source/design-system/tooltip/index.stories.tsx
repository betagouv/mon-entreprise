import { Meta, StoryObj } from '@storybook/react'

import { Link } from '../typography/link'
import { Tooltip } from './'

const meta: Meta<typeof Tooltip> = {
	component: Tooltip,
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Basic: Story = {
	args: {
		children: 'Passez la souris sur moi',
		tooltip: 'Coucou !',
	},
}

export const WithLink: Story = {
	args: {
		children: <>Avec un élément focusable</>,
		tooltip: (
			<>
				Coucou ! Voici un lien vers{' '}
				<Link href="https://mon-entreprise.urssaf.fr">mon-entreprise</Link>.
				Enjoy&nbsp; !
			</>
		),
	},
}
