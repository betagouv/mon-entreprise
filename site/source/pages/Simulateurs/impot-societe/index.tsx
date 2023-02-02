import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { updateSituation } from '@/actions/actions'
import Value from '@/components/EngineValue'
import Notifications from '@/components/Notifications'
import { SimulationGoal, SimulationGoals } from '@/components/Simulation'
import RuleInput from '@/components/conversation/RuleInput'
import Warning from '@/components/ui/WarningBlock'
import { FromTop } from '@/components/ui/animate'
import { H2 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { situationSelector } from '@/selectors/simulationSelectors'

import { TrackPage } from '../../../ATInternetTracking'

export default function ISSimulation() {
	return (
		<>
			<Warning
				localStorageKey={'app::simulateurs:warning-folded:v1:impôt-societé'}
			>
				<Body>
					<Trans i18nKey="impotSociété.warning">
						Ce simulateur s’adresse aux{' '}
						<abbr title="Très Petites Entreprises">TPE</abbr> : il prend en
						compte les taux réduits de l’impôt sur les sociétés.
					</Trans>
				</Body>
			</Warning>
			<Notifications />
			<SimulationGoals
				toggles={<ExerciceDate />}
				legend="Résultat imposable de l'entreprise"
			>
				<SimulationGoal dottedName="entreprise . imposition . IS . résultat imposable" />
			</SimulationGoals>
			<Explanations />
		</>
	)
}

const ExerciceDateContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
`

function ExerciceDate() {
	const dispatch = useDispatch()

	return (
		<ExerciceDateContainer>
			<RuleInput
				dottedName={'entreprise . exercice . début'}
				showDefaultDateValue
				onChange={(x) =>
					dispatch(updateSituation('entreprise . exercice . début', x))
				}
			/>{' '}
			<RuleInput
				dottedName={'entreprise . exercice . fin'}
				showDefaultDateValue
				onChange={(x) =>
					dispatch(updateSituation('entreprise . exercice . fin', x))
				}
			/>
		</ExerciceDateContainer>
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
		return <TrackPage name="accueil" />
	}

	return (
		<FromTop>
			<TrackPage name="simulation terminée" />
			<ExplanationsContainer>
				<Intro>
					<Value
						expression="entreprise . imposition . IS . montant"
						displayedUnit="€"
						className="payslip__total"
					/>
				</Intro>
				<Body
					className="notice"
					css={`
						margin-top: -1rem;
					`}
				>
					<Trans>Montant de l'impôt sur les sociétés</Trans>
				</Body>
			</ExplanationsContainer>
		</FromTop>
	)
}

export const SeoExplanations = () => (
	<Trans i18nKey="pages.simulateurs.is.seo">
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
