import { useMatch } from 'react-router-dom'

import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type ChoixStatut = RelativeSitePaths['assistants']['choix-du-statut']
type Step = keyof ChoixStatut

const stepOrder: readonly Step[] = [
	'index',
	'recherche-activité',
	'détails-activité',
	'commune',
	'association',
	'associé',
	'rémunération',
	'comparateur',
] as const

export function useCurrentStep() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const localizedStep = useMatch(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)?.params.step
	if (!localizedStep) {
		return 'index'
	}

	const entries = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	) as [Step, ChoixStatut[Step]][]

	const [currentStep] =
		entries.find(([, value]) => value === localizedStep) ?? []

	return currentStep
}

export function useNextStep() {
	const currentStep = useCurrentStep()
	const nextStep =
		stepOrder[currentStep ? stepOrder.indexOf(currentStep) + 1 : 0]

	return nextStep
}

export function usePreviousStep() {
	const currentStep = useCurrentStep()
	const previousStep =
		stepOrder[currentStep ? stepOrder.indexOf(currentStep) - 1 : 0]

	return previousStep
}
