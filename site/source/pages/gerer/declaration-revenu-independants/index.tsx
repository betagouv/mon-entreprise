import { DottedName } from '@/../../modele-social'
import { Condition } from '@/components/EngineValue'
import PageHeader from '@/components/PageHeader'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Step, Stepper } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Redirect, Route, Switch } from 'react-router'
import Cotisations from './cotisations'
import Déclaration, { useObjectifs as useStep3Objectifs } from './declaration'
import Entreprise, { OBJECTIFS as Step1Objectifs } from './entreprise'
import Imposition, { OBJECTIFS as Step2Objectifs } from './imposition'
import { useProgress } from './_components/hooks'
import illustration from './_components/undraw_fill_in_mie5.svg'
import config from './_config.yaml'

export default function AideDéclarationIndépendant() {
	useSimulationConfig(config)
	const steps = useSteps()
	const defaultCurrentStep =
		steps
			.filter((step) => !step.isDisabled)
			.find((step) => step.progress !== 1) ??
		steps.find((step) => !step.isDisabled)

	return (
		<Condition expression="DRI">
			<Trans i18nKey="assistant-DRI.intro">
				<PageHeader picture={illustration}>
					<Intro>
						Nous vous accompagnons pour remplir votre{' '}
						<Strong>déclaration de revenu</Strong> sur{' '}
						<Link href="https://www.impots.gouv.fr/accueil">impot.gouv.fr</Link>
						.<br />
					</Intro>
					<Body> Répondez à quelques questions, à la fin vous aurez :</Body>
					<Ul>
						<Li>Les formulaires qui vous concernent</Li>
						<Li>
							La liste des cases qui vous concernent avec le montant à remplir
						</Li>
						<Li>
							Une estimation des cotisations sociales à payer à l'Urssaf en 2022
						</Li>
					</Ul>
				</PageHeader>
			</Trans>
			<Spacing lg />
			<Stepper aria-label="Étapes de l'assistant">
				{steps.map((step) => (
					<Step key={step.to} {...step} />
				))}
			</Stepper>
			<Switch>
				{steps.map(
					(step) =>
						step.page &&
						!step.isDisabled && (
							<Route key={step.to} path={step.to} exact component={step.page} />
						)
				)}
				{defaultCurrentStep && <Redirect to={defaultCurrentStep.to} />}
			</Switch>
			<Spacing xxl />
		</Condition>
	)
}

function useSteps() {
	const sitePaths = useContext(SitePathsContext).gérer.déclarationIndépendant
	const { t } = useTranslation()
	const step1Progress = useProgress(Step1Objectifs)
	const step2Progress = useProgress(Step2Objectifs)
	const step3Progress = useProgress(useStep3Objectifs())
	const step4Progress = useSimulationProgress()
	const casExclu = useEngine().evaluate('DRI . cas exclus ').nodeValue

	return [
		{
			to: sitePaths.entreprise,
			progress: step1Progress,
			children: t('Mon entreprise'),
			page: Entreprise,
		},
		{
			to: sitePaths.imposition,
			progress: casExclu ? 0 : step2Progress,
			children: t('Mon imposition'),
			page: Imposition,
			isDisabled: step1Progress !== 1 || casExclu,
		},
		{
			to: sitePaths.déclaration,
			progress: step3Progress,
			children: t('Ma déclaration'),
			page: Déclaration,
			isDisabled: step2Progress !== 1,
		},
		{
			to: sitePaths.cotisations,
			progress: step4Progress,
			page: Cotisations,
			children: t('Mes cotisations'),
			isDisabled: step3Progress !== 1,
		},
	]
}
