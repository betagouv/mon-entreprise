import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { useComparateur } from '@/contextes/comparateur'
import { Body, H4, Link, Message, Strong } from '@/design-system'
import { montantToString } from '@/domaine/Montant'
import { toEurosParAn } from '@/domaine/MontantRecurrent'

import { ComparaisonÉlément } from './ComparaisonElement'

export const ComparaisonRetraite = () => {
	const { situation } = useComparateur()
	const { t } = useTranslation()

	return (
		<>
			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.retraite.base.h4',
					'Retraite de base'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.base.body">
					Chaque année, selon votre rémunération, vous validez{' '}
					<Strong>jusqu'à 4 trimestres</Strong> pour votre retraite de base. Le
					nombre total de trimestres validés détermine votre droit à une
					retraite à taux plein.
				</Trans>
			</Body>

			<ComparaisonÉlément
				catégorieComparée="retraite"
				élémentComparé="trimestres"
				displayedUnit={t(
					'pages.simulateurs.comparaison-statuts.items.retraite.base.unit',
					'trimestre(s) acquis par an'
				)}
			/>

			{!situation.activitéLibéraleRéglementée && (
				<>
					<Body>
						<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.base.revenu-cotisé.body">
							Le montant de votre pension dépend aussi du{' '}
							<Strong>revenu cotisé</Strong>, c'est-à-dire la part de vos
							revenus sur laquelle vous cotisez pour la retraite de base.
						</Trans>
					</Body>

					<ComparaisonÉlément
						catégorieComparée="retraite"
						élémentComparé="revenuCotisé"
						convertisseur={toEurosParAn}
						displayedUnit={t(
							'pages.simulateurs.comparaison-statuts.items.retraite.base.unité',
							'€ cotisés par an'
						)}
					/>
				</>
			)}

			<H4>
				{t(
					'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.h4',
					'Retraite complémentaire'
				)}
			</H4>

			<Body>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.body">
					Tous les ans, selon votre rémunération,{' '}
					<Strong>vous gagnez des points de retraite complémentaire</Strong>. En
					fin de carrière, vos points sont convertis en pension mensuelle qui
					s'ajoute à votre retraite de base.
				</Trans>
			</Body>

			<ComparaisonÉlément
				catégorieComparée="retraite"
				élémentComparé="pointsComplémentaire"
				displayedUnit={t(
					'pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.unité',
					'point(s) acquis par an'
				)}
				footer={(résultatModèle) => {
					const valeurPointComplémentaire = montantToString(
						résultatModèle.retraite().valeurPointComplémentaire
					)

					return (
						<BodyNoMargin>
							<Trans
								i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.complémentaire.valeur-du-point"
								shouldUnescape
							>
								Valeur du point&nbsp;:{' '}
								<Strong>{{ valeurPointComplémentaire }}</Strong>
							</Trans>
						</BodyNoMargin>
					)
				}}
			/>

			<Message type="info" border={false}>
				<Body>
					<Trans i18nKey="pages.simulateurs.comparaison-statuts.items.retraite.lien-assurance-retraite.message">
						Pour estimer le montant de votre future pension de retraite,
						utilisez le{' '}
						<Link
							href="https://www.lassuranceretraite.fr/portail-info/hors-menu/annexe/services-en-ligne/estimation-montant-retraite.html"
							aria-label={t(
								'pages.simulateurs.comparaison-statuts.items.retraite.lien-assurance-retraite.aria-label',
								"Accéder au simulateur de l'Assurance retraite, nouvelle fenêtre"
							)}
						>
							simulateur de l'Assurance retraite
						</Link>
						.
					</Trans>
				</Body>
			</Message>
		</>
	)
}

const BodyNoMargin = styled(Body)`
	margin: 0;
`
