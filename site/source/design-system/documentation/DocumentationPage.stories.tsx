import type { Meta, StoryObj } from '@storybook/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'

import { DocumentationPage } from './DocumentationPage'

const meta = {
	component: DocumentationPage,
	parameters: {
		layout: 'padded',
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'Titre de la page de documentation',
		},
		backToDocumentationUrl: {
			control: 'text',
			description: 'URL de retour vers la documentation',
		},
		backToSimulatorUrl: {
			control: 'text',
			description: 'URL de retour vers le simulateur',
		},
		backToDocumentationLabel: {
			control: 'text',
			description: 'Label du lien de retour à la documentation',
			defaultValue: '← Retour à la documentation',
		},
		backToSimulatorLabel: {
			control: 'text',
			description: 'Label du lien vers le simulateur',
			defaultValue: 'Simulateur',
		},
	},
	decorators: [
		(Story) => (
			<HelmetProvider>
				<MemoryRouter
					initialEntries={[
						'/simulateurs/location-de-logement-meuble/documentation/test',
					]}
				>
					<div style={{ padding: '2rem' }}>
						<Story />
					</div>
				</MemoryRouter>
			</HelmetProvider>
		),
	],
} satisfies Meta<typeof DocumentationPage>

export default meta
type Story = StoryObj<typeof meta>

export const Simple: Story = {
	args: {
		title: "L'abattement forfaitaire",
		backToDocumentationUrl:
			'/simulateurs/location-de-logement-meuble/documentation',
		backToSimulatorUrl: '/simulateurs/location-de-logement-meuble',
		children: (
			<>
				<h1>L'abattement forfaitaire en location meublée</h1>
				<p>
					L'abattement forfaitaire est une déduction automatique appliquée à vos
					recettes brutes pour déterminer votre bénéfice imposable.
				</p>
				<h2>Taux d'abattement</h2>
				<h3>50% - Location meublée classique</h3>
				<p>Ce taux s'applique pour :</p>
				<ul>
					<li>La location meublée de longue durée</li>
					<li>La location meublée saisonnière non classée</li>
					<li>Les autres types de location meublée</li>
				</ul>
				<h3>71% - Location meublée touristique</h3>
				<p>Ce taux avantageux s'applique uniquement pour :</p>
				<ul>
					<li>Les meublés de tourisme classés</li>
					<li>Les chambres d'hôtes</li>
				</ul>
			</>
		),
	},
}

export const ContenuMinimal: Story = {
	args: {
		title: 'Page de test',
		backToDocumentationUrl: '/documentation',
		backToSimulatorUrl: '/simulateur',
		backToDocumentationLabel: '← Retour',
		backToSimulatorLabel: 'Outil de calcul',
		children: (
			<>
				<h1>Titre de la page</h1>
				<p>Un simple paragraphe de contenu.</p>
			</>
		),
	},
}

const ExempleCalcul = () => (
	<div
		style={{
			backgroundColor: '#f0f4f8',
			padding: '1rem',
			borderRadius: '0.5rem',
			margin: '1rem 0',
		}}
	>
		<h4 style={{ marginTop: 0 }}>Exemple de calcul</h4>
		<p>Recettes annuelles : 50 000 €</p>
		<p>Abattement 50% : -25 000 €</p>
		<p>
			<strong>Bénéfice imposable : 25 000 €</strong>
		</p>
	</div>
)

export const AvecComposantReact: Story = {
	args: {
		title: 'Documentation avec composants',
		backToDocumentationUrl:
			'/simulateurs/location-de-logement-meuble/documentation',
		backToSimulatorUrl: '/simulateurs/location-de-logement-meuble',
		children: (
			<>
				<h1>Documentation interactive</h1>
				<p>
					Cette documentation peut intégrer des composants React pour enrichir
					l'expérience utilisateur.
				</p>

				<ExempleCalcul />

				<p>
					Les composants peuvent être utilisés pour afficher des calculs
					dynamiques, des graphiques ou toute autre interaction.
				</p>
			</>
		),
	},
}
