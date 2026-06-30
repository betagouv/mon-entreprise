import { Option } from 'effect'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ObjectifDeSimulation } from '@/components/Simulation/ObjectifDeSimulation'
import {
	annéeDeSimulation,
	annéeDesRevenus,
	calculeCotisationMaladie,
	SituationFrontalierSuisseValide,
} from '@/contextes/frontalier-suisse'
import { Body, Link, Message, SmallBody } from '@/design-system'
import { useSitePaths } from '@/sitePaths'

export const RésultatCotisation = ({
	situation,
}: {
	situation: SituationFrontalierSuisseValide
}) => {
	const { t, i18n } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	const dateAffiliation = situation.dateAffiliation.value
	const dateFinAffiliation = Option.getOrUndefined(situation.dateFinAffiliation)
	const annéeRevenus = annéeDesRevenus(dateAffiliation, dateFinAffiliation)
	const cotisation = calculeCotisationMaladie(situation)

	const documentationUrl =
		absoluteSitePaths.simulateurs['cotisation-maladie-frontalier-suisse'] +
		'/documentation'

	const formatDate = (date: Date) =>
		date.toLocaleDateString(i18n.language === 'en' ? 'en-GB' : 'fr-FR')

	const débuteDansLAnnée = dateAffiliation.getFullYear() === annéeRevenus
	const finitDansLAnnée = dateFinAffiliation?.getFullYear() === annéeRevenus

	const descriptionProrata =
		débuteDansLAnnée && finitDansLAnnée
			? t(
					'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.période',
					'du {{début}} au {{fin}}',
					{
						début: formatDate(dateAffiliation),
						fin: formatDate(dateFinAffiliation),
						interpolation: { escapeValue: false },
					}
			  )
			: finitDansLAnnée
			? t(
					'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.jusquà',
					'jusqu’au {{date}}',
					{
						date: formatDate(dateFinAffiliation),
						interpolation: { escapeValue: false },
					}
			  )
			: t(
					'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.depuis',
					'à partir du {{date}}',
					{
						date: formatDate(dateAffiliation),
						interpolation: { escapeValue: false },
					}
			  )

	return (
		<>
			<ObjectifDeSimulation
				id="frontalier-suisse-cotisation-annuelle"
				titre={
					<Link to={documentationUrl}>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.annuel',
							'Cotisation maladie annuelle'
						)}
					</Link>
				}
				explication={
					<NoteEstimation>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.estimation',
							'Estimation d’après vos revenus {{annéeRevenus}},\napplicable à votre cotisation {{annéeApplication}}.',
							{ annéeRevenus, annéeApplication: annéeRevenus + 2 }
						)}
					</NoteEstimation>
				}
				valeur={Option.some(cotisation.annuel)}
			/>
			<ObjectifDeSimulation
				id="frontalier-suisse-cotisation-mensuelle"
				titre={
					<Link to={documentationUrl}>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.mensuel',
							'Cotisation maladie mensuelle'
						)}
					</Link>
				}
				valeur={Option.some(cotisation.mensuel)}
			/>
			{Option.isSome(cotisation.prorataAnnéePartielle) && (
				<ObjectifDeSimulation
					id="frontalier-suisse-cotisation-prorata"
					titre={
						<Link to={documentationUrl}>
							{t(
								'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.prorata.titre',
								'Cotisation {{année}} au prorata',
								{ année: annéeRevenus }
							)}
						</Link>
					}
					valeur={Option.some(cotisation.prorataAnnéePartielle.value)}
					description={descriptionProrata}
					small
				/>
			)}
			{annéeRevenus > annéeDeSimulation() && (
				<Message type="info" mini>
					<Body>
						{t(
							'pages.simulateurs.cotisation-maladie-frontalier-suisse.résultat.avertissement-futur',
							'Votre affiliation étant à venir, cette estimation suppose que le taux et le plafond de cotisation n’évoluent pas d’ici là.'
						)}
					</Body>
				</Message>
			)}
		</>
	)
}

const NoteEstimation = styled(SmallBody)`
	margin: 0;
	font-weight: normal;
	white-space: pre-line;
`
