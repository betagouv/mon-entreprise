import { useTranslation } from 'react-i18next'

import { Accordion, Container, Emoji, H2, Item } from '@/design-system'

import { CartesStatuts } from './CartesStatuts'
import { ComparaisonInvaliditéDécès } from './ComparaisonInvaliditeDeces'
import { ComparaisonParentalité } from './ComparaisonParentalite'
import { ComparaisonRetraite } from './ComparaisonRetraite'
import { ComparaisonRevenus } from './ComparaisonRevenus'
import { ComparaisonSanté } from './ComparaisonSante'
import ItemTitle from './ItemTitle'

export const Comparaison = () => {
	const { t } = useTranslation()

	return (
		<Container
			backgroundColor={(theme) =>
				theme.darkMode
					? theme.colors.extended.dark[800]
					: theme.colors.bases.primary[200]
			}
		>
			<Accordion
				variant="light"
				defaultExpandedKeys={['revenus']}
				title={
					<H2>
						{t(
							'pages.simulateurs.comparaison-statuts.accordion-title',
							'Comparer…'
						)}
					</H2>
				}
				isFoldable
				banner={<CartesStatuts />}
			>
				<Item
					key="revenus"
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.revenus.title',
								'Vos revenus'
							)}
							&nbsp;
							<Emoji emoji="🤑" />
						</ItemTitle>
					}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.revenus.title',
						'Vos revenus'
					)}
					hasChildItems={false}
				>
					<ComparaisonRevenus />
				</Item>

				<Item
					key="retraite"
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.retraite.title',
								'Vos droits pour la retraite'
							)}
							&nbsp;
							<Emoji emoji="🧐" />
						</ItemTitle>
					}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.retraite.title',
						'Vos droits pour la retraite'
					)}
					hasChildItems={false}
				>
					<ComparaisonRetraite />
				</Item>

				<Item
					key="santé"
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.santé.title',
								'Vos prestations santé'
							)}
							&nbsp;
							<Emoji emoji="😷" />
						</ItemTitle>
					}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.santé.title',
						'Vos prestations santé'
					)}
					hasChildItems={false}
				>
					<ComparaisonSanté />
				</Item>

				<Item
					key="parentalité"
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.parentalité.title',
								'La maternité, paternité et adoption'
							)}
							&nbsp;
							<Emoji emoji="🤗" />
						</ItemTitle>
					}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.parentalité.title',
						'La maternité, paternité et adoption'
					)}
					hasChildItems={false}
				>
					<ComparaisonParentalité />
				</Item>

				<Item
					key="invalidité-décès"
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.prévoyance.title',
								'Votre couverture invalidité et décès'
							)}
							&nbsp;
							<Emoji emoji="🤕" />
						</ItemTitle>
					}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.prévoyance.title',
						'Votre couverture invalidité et décès'
					)}
					hasChildItems={false}
				>
					<ComparaisonInvaliditéDécès />
				</Item>

				{/* <Item
					title={
						<ItemTitle>
							{t(
								'pages.simulateurs.comparaison-statuts.items.gestion.title',
								'La gestion juridique et comptable'
							)}
							&nbsp;
							<Emoji emoji="🤓" />
						</ItemTitle>
					}
					key="administratif"
					hasChildItems={false}
					textValue={t(
						'pages.simulateurs.comparaison-statuts.items.gestion.title',
						'La gestion juridique et comptable'
					)}
				>
					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.création.h4',
							'Coût de création'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.création.body">
							Les formalités de création d’une entreprise diffèrent selon les
							statuts et la nature de l’activité. Le calcul se concentre ici sur
							les <Strong>procédures obligatoires</Strong> (immatriculation,
							annonces légales, rédaction des statuts…).
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="gestion"
						élémentComparé="coûtsDeCréation"
						displayedUnit="€ HT"
					/>

					<H4>
						{t(
							'pages.simulateurs.comparaison-statuts.items.gestion.conjoint.h4',
							'Statut du conjoint / de la conjointe'
						)}
					</H4>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.gestion.conjoint.body">
							Vous êtes marié/mariée, pacsé/pacsée ou en union libre&nbsp;: il
							existe <Strong>3 statuts possibles</Strong> pour votre
							conjoint/conjointe (<Strong>collaborateur/collaboratrice</Strong>,{' '}
							<Strong>associé/associée</Strong> ou{' '}
							<Strong>salarié/salariée</Strong>).
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="gestion"
						élémentComparé="statutConjointe"
					/>
				</Item> */}
			</Accordion>
		</Container>
	)
}
