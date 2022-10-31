import BetaBanner from '@/components/BetaBanner'
import { Condition } from '@/components/EngineValue'
import PrintExportRecover from '@/components/simulationExplanation/PrintExportRecover'
import { useEngine } from '@/components/utils/EngineContext'
import { useSimulationProgress } from '@/components/utils/useNextQuestion'
import useSimulationConfig from '@/components/utils/useSimulationConfig'
import { Step, Stepper } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Body, Intro } from '@/design-system/typography/paragraphs'
import { SimulationConfig } from '@/reducers/rootReducer'
import { useSitePaths } from '@/sitePaths'
import { omit } from '@/utils'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes } from 'react-router-dom'
import Cotisations from './cotisations'
import Déclaration, { useObjectifs as useStep3Objectifs } from './declaration'
import Entreprise, { OBJECTIFS as Step1Objectifs } from './entreprise'
import Imposition, { OBJECTIFS as Step2Objectifs } from './imposition'
import { useProgress } from './_components/hooks'

const config: SimulationConfig = {
	objectifs: ['DRI . cotisations'],
	questions: {
		'liste noire': [
			'dirigeant . indépendant . cotisations facultatives',
			'entreprise . salariés . effectif . seuil',
			'entreprise . imposition . régime . micro-entreprise',
		],
		liste: [
			'DRI . cotisations',
			// pourquois ça ?
			'',
		],
	},
	'unité par défaut': '€',
	situation: {
		DRI: 'oui',
		impôt: {
			'non applicable si': 'oui',
		},
	},
}

export default function AideDéclarationIndépendant() {
	const { absoluteSitePaths } = useSitePaths()
	useSimulationConfig({
		path: absoluteSitePaths.gérer.déclarationIndépendant.beta.index,
		config,
		autoloadLastSimulation: true,
	})
	const steps = useSteps()
	const defaultCurrentStep =
		steps
			.filter((step) => !step.isDisabled)
			.find((step) => step.progress !== 1) ??
		steps.find((step) => !step.isDisabled)
	const { t } = useTranslation()

	return (
		<>
			<PrintExportRecover />
			<Condition expression="DRI">
				<BetaBanner>
					<H3 as="h2">
						<Strong>Cet assistant est en version beta</Strong>
					</H3>
					<Intro>
						Nous travaillons à valider les informations et les calculs, mais des{' '}
						<Strong>erreurs peuvent être présentes</Strong>.
					</Intro>
					<Body>
						Bien qu'il ne soit pas terminé, nous avons choisi de publier cet
						outil pour avoir vos retours. Si vous pensez avoir trouvé un
						problème ou si vous voulez nous partager une remarque, vous pouvez
						nous contacter via le bouton « Faire une suggestion » en bas de
						page.
					</Body>
				</BetaBanner>
				<Spacing lg />
				<div className="print-hidden">
					<Stepper aria-label="Étapes de l'assistant">
						{steps.map((step) => (
							<Step
								key={step.to}
								aria-label={t("Accéder à l'étape {{step}}", {
									step: step.children,
								})}
								{...omit(step, 'page')}
							/>
						))}
					</Stepper>
				</div>
				<Routes>
					{steps.map(
						(step) =>
							!step.isDisabled && (
								<Route key={step.to} path={step.to} element={<step.page />} />
							)
					)}
					<Route
						path="*"
						element={
							<Navigate to={(defaultCurrentStep || steps[0]).to} replace />
						}
					/>
				</Routes>
				<Spacing xl />
			</Condition>
		</>
	)
}

function useSteps() {
	const sitePaths =
		useSitePaths().relativeSitePaths.gérer.déclarationIndépendant.beta
	const { t } = useTranslation()
	const step1Progress = useProgress(Step1Objectifs)
	const step2Progress = useProgress(Step2Objectifs)
	const step3Progress = useProgress(useStep3Objectifs())
	const { progressRatio: step4Progress } = useSimulationProgress()
	const casExcluStep1 = useEngine().evaluate('DRI . cas exclus ')
		.nodeValue as boolean
	const casExcluStep2 = useEngine().evaluate('DRI . imposition cas exclus')
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
			progress: casExcluStep1 ? 0 : step2Progress,
			children: t('Mon imposition'),
			page: Imposition,
			isDisabled: step1Progress !== 1 || casExcluStep1,
		},
		{
			to: sitePaths.déclaration,
			progress: step3Progress,
			children: t('Ma déclaration'),
			page: Déclaration,
			isDisabled: step2Progress !== 1 || casExcluStep2,
		},
		{
			to: sitePaths.cotisations,
			progress: step3Progress !== 1 ? 0 : step4Progress,
			page: Cotisations,
			children: t('Mes cotisations'),
			isDisabled: step3Progress !== 1,
		},
	]
}
