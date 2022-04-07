import { Condition } from '@/components/EngineValue'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Step, Stepper } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { omit } from '@/utils'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, Route, Switch } from 'react-router'
import Cotisations from './cotisations'
import Déclaration, { useObjectifs as useStep3Objectifs } from './declaration'
import Entreprise, { OBJECTIFS as Step1Objectifs } from './entreprise'
import Imposition, { OBJECTIFS as Step2Objectifs } from './imposition'
import { useProgress } from './_components/hooks'
import config from './_config.yaml'

export default function AideDéclarationIndépendant() {
	const sitePaths = useContext(SitePathsContext)
	useSimulationConfig(config, {
		path: sitePaths.gérer.déclarationIndépendant.index,
		autoloadLastSimulation: true,
	})
	const steps = useSteps()
	const defaultCurrentStep =
		steps
			.filter((step) => !step.isDisabled)
			.find((step) => step.progress !== 1) ??
		steps.find((step) => !step.isDisabled)

	return (
		<>
			<Condition expression="DRI">
				<Stepper aria-label="Étapes de l'assistant">
					{steps.map((step) => (
						<Step key={step.to} {...omit(step, 'page')} />
					))}
				</Stepper>
				<Switch>
					{steps.map(
						(step) =>
							step.page &&
							!step.isDisabled && (
								<Route
									key={step.to}
									path={step.to}
									exact
									component={step.page}
								/>
							)
					)}
					{defaultCurrentStep && <Redirect to={defaultCurrentStep.to} />}
				</Switch>
				<Spacing xxl />
			</Condition>
		</>
	)
}

function useSteps() {
	const sitePaths = useContext(SitePathsContext).gérer.déclarationIndépendant
	const { t } = useTranslation()
	const step1Progress = useProgress(Step1Objectifs)
	const step2Progress = useProgress(Step2Objectifs)
	const step3Progress = useProgress(useStep3Objectifs())
	const step4Progress = useSimulationProgress()
	const casExclu = useEngine().evaluate('DRI . cas exclus ')
		.nodeValue as boolean

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
