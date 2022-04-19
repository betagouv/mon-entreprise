import { Condition } from '@/components/EngineValue'
import Warning from '@/components/ui/WarningBlock'
import { useEngine } from '@/components/utils/EngineContext'
import { SitePathsContext } from '@/components/utils/SitePathsContext'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Step, Stepper } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Li, Ul } from '@/design-system/typography/list'
import { omit } from '@/utils'
import { Grid } from '@mui/material'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, Route, Switch } from 'react-router'
import Cotisations from './cotisations'
import Déclaration, { useObjectifs as useStep3Objectifs } from './declaration'
import Entreprise, { OBJECTIFS as Step1Objectifs } from './entreprise'
import Imposition, { OBJECTIFS as Step2Objectifs } from './imposition'
import Exceptions from './_components/Exceptions'
import { useProgress } from './_components/hooks'
import config from './_config.yaml'

export default function AideDéclarationIndépendant() {
	const sitePaths = useContext(SitePathsContext)
	useSimulationConfig(config, {
		path: sitePaths.gérer.déclarationIndépendant.beta,
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
				<Grid container>
					<Grid item lg={10} xl={8}>
						<Warning localStorageKey="DRI">
							<Ul>
								<Li>
									Cet assistant est proposé à titre indicatif. Vous restez
									entièrement responsable d'éventuels oublis ou inexactitudes
									dans votre déclaration. En cas de doutes, rapprochez-vous de
									votre comptable.
								</Li>
								<Li>
									Cet assistant ne prend pas en compte tous les types
									d'entreprises ni tous les dispositifs fiscaux applicables.{' '}
									<Exceptions />
								</Li>
								<Li>
									Le calcul des cotisations est une estimation : seuls les
									montant effectivement appelés par l'Urssaf seront valides en
									fin de compte.
								</Li>
							</Ul>
						</Warning>
					</Grid>
				</Grid>
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

				<Spacing xl />
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
