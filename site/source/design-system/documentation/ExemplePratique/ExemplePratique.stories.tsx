import type { Meta, StoryObj } from '@storybook/react'

import { ExemplePratique } from './index'

const meta = {
	component: ExemplePratique,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof ExemplePratique>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		children: (
			<>
				Pour des recettes de 20 000 € en location classique :
				<ul>
					<li>
						Abattement de 50% : <strong>10 000 €</strong>
					</li>
					<li>
						Base imposable : <strong>10 000 €</strong>
					</li>
				</ul>
			</>
		),
	},
}

export const CalculDetaille: Story = {
	args: {
		children: (
			<>
				<p>Calcul pour une location meublée de tourisme classée :</p>
				<p>
					Recettes annuelles : <strong>50 000 €</strong>
				</p>
				<ul>
					<li>Abattement forfaitaire (71%) : 35 500 €</li>
					<li>Base imposable : 14 500 €</li>
					<li>Impôt sur le revenu (TMI 30%) : 4 350 €</li>
					<li>Prélèvements sociaux (17,2%) : 2 494 €</li>
				</ul>
				<p>
					Total des prélèvements : <strong>6 844 €</strong>
				</p>
			</>
		),
	},
}

export const ComparaisonRegimes: Story = {
	args: {
		children: (
			<>
				<p>Comparaison micro-BIC vs régime réel pour 30 000 € de recettes :</p>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '1rem',
					}}
				>
					<div>
						<strong>Micro-BIC</strong>
						<ul>
							<li>Abattement : 15 000 €</li>
							<li>Base imposable : 15 000 €</li>
						</ul>
					</div>
					<div>
						<strong>Régime réel</strong>
						<ul>
							<li>Charges réelles : 18 000 €</li>
							<li>Base imposable : 12 000 €</li>
						</ul>
					</div>
				</div>
				<p>→ Le régime réel est plus avantageux dans ce cas</p>
			</>
		),
	},
}
