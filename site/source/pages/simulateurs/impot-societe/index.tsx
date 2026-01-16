import * as O from 'effect/Option'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import {
	ACCUEIL,
	SIMULATION_TERMINEE,
	TrackPage,
} from '@/components/ATInternetTracking'
import RuleInput from '@/components/conversation/RuleInput'
import Value from '@/components/EngineValue/Value'
import Notifications from '@/components/Notifications'
import ShareOrSaveSimulationBanner from '@/components/ShareSimulationBanner'
import SimulateurWarning from '@/components/SimulateurWarning'
import {
	SimulationContainer,
	SimulationGoal,
	SimulationGoals,
} from '@/components/Simulation'
import { FromTop } from '@/components/ui/animate'
import { Body, H2, Intro, Link, StyledInputSuggestion } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import useYear from '@/hooks/useYear'
import {
	enregistreLaRéponseÀLaQuestion,
	enregistreLesRéponsesAuxQuestions,
} from '@/store/actions/actions'
import { situationSelector } from '@/store/selectors/simulation/situation/situation.selector'

export default function ISSimulation() {
	return (
		<SimulationContainer>
			<SimulateurWarning
				simulateur="is"
				informationsComplémentaires={
					<Body>
						<Trans i18nKey="pages.simulateurs.is.warning">
							Ce simulateur s’adresse aux{' '}
							<abbr title="Très Petites Entreprises">TPE</abbr> : il prend en
							compte les taux réduits de l’impôt sur les sociétés.
						</Trans>
					</Body>
				}
			/>
			<Notifications />

			<SimulationGoals toggles={<ExerciceDate />}>
				<SimulationGoal dottedName="entreprise . imposition . IS . résultat imposable" />
			</SimulationGoals>
			<Explanations />
		</SimulationContainer>
	)
}

const ExerciceDateContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
`

function ExerciceDate() {
	const dispatch = useDispatch()
	const { t } = useTranslation()
	const currentYear = useYear()
	const yearN2 = currentYear - 2
	const yearN1 = currentYear - 1

	return (
		<div>
			<ExerciceDateContainer>
				<StyledInputSuggestion>
					{[yearN2, yearN1].map((year) => (
						<React.Fragment key={year}>
							<Link
								aria-label={t(
									'pages.simulateurs.impot-société.préremplir',
									'Préremplir avec les dates de l’exercice {{ year }}',
									{ year }
								)}
								onPress={() => {
									dispatch(
										enregistreLesRéponsesAuxQuestions({
											'entreprise . exercice . début': O.some(`01/01/${year}`),
											'entreprise . exercice . fin': O.some(`31/12/${year}`),
										} as Record<DottedName, O.Option<ValeurPublicodes>>)
									)
								}}
							>
								{t(
									'pages.simulateurs.impot-société.exercice',
									'Exercice {{ year }}',
									{ year }
								)}
							</Link>{' '}
						</React.Fragment>
					))}
				</StyledInputSuggestion>
			</ExerciceDateContainer>

			<ExerciceDateContainer>
				<RuleInput
					dottedName={'entreprise . exercice . début'}
					onChange={(x) =>
						dispatch(
							enregistreLaRéponseÀLaQuestion('entreprise . exercice . début', x)
						)
					}
				/>{' '}
				<RuleInput
					dottedName={'entreprise . exercice . fin'}
					onChange={(x) =>
						dispatch(
							enregistreLaRéponseÀLaQuestion('entreprise . exercice . fin', x)
						)
					}
				/>
			</ExerciceDateContainer>
		</div>
	)
}

const ExplanationsContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-items: center;
	align-items: center;
`

function Explanations() {
	const situation = useSelector(situationSelector)

	const showResult =
		situation['entreprise . imposition . IS . résultat imposable']

	if (!showResult) {
		return <TrackPage name={ACCUEIL} />
	}

	return (
		<FromTop>
			<TrackPage name={SIMULATION_TERMINEE} />
			<ExplanationsContainer>
				<Intro>
					<Value
						expression="entreprise . imposition . IS . total"
						displayedUnit="€"
						className="payslip__total"
					/>
				</Intro>
				<Body
					className="notice"
					style={{
						marginTop: '-1rem',
					}}
				>
					<Trans i18nKey="pages.simulateurs.impot-société.montant">
						Montant de l’impôt sur les sociétés
					</Trans>
				</Body>
				<ShareOrSaveSimulationBanner share />
			</ExplanationsContainer>
		</FromTop>
	)
}

export const SeoExplanations = () => (
	<Trans i18nKey="pages.simulateurs.impot-société.seo">
		<H2>Comment est calculé l’impôt sur les sociétés ?</H2>
		<Body>
			L’impôt sur les sociétés s’applique aux bénéfices réalisés par les
			sociétés de capitaux (SA, SAS, SASU, SARL, etc.) et sur option facultative
			pour certaines autres sociétés (EIRL, EURL, SNC, etc.).
		</Body>
		<Body>
			Il est calculé sur la base des bénéfices réalisés en France au cours de
			l’exercice comptable. La durée d’un exercice est normalement d’un an mais
			il peut être plus court ou plus long (notamment en début d’activité ou à
			la dissolution de l’entreprise). Dans ce cas le barème de l’impôt est
			pro-ratisé en fonction de la durée de l’exercice, ce qui est pris en
			compte dans le simulateur en modifiant les dates de début et de fin de
			l’exercice.
		</Body>
		<H2>Taux réduit et régimes spécifiques</H2>
		<Body>
			Les PME réalisant moins de 7,63 millions d’euros de chiffre d’affaires et
			dont le capital est détenu à 75% par des personnes physiques bénéficient
			d’un taux réduit d’impôt sur les sociétés. Ce taux est pris en compte sur
			le simulateur et il n’est pour l’instant pas possible de simuler
			l’inéligibilité aux taux réduits.
		</Body>
		<Body>
			Enfin il existe des régimes d’impositions spécifiques avec des taux dédiés
			pour certains types de plus-values (cession de titres, cession de
			brevets). Ces régimes ne sont pas intégrés dans le simulateur.
		</Body>
	</Trans>
)
