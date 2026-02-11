import { useNavigation } from '@/lib/navigation'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type ChoixStatut = RelativeSitePaths['assistants']['choix-du-statut']
type Step = Exclude<keyof ChoixStatut, 'résultat'>

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
	const { matchPath } = useNavigation()
	const match = matchPath(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)
	const localizedStep = match?.params.step
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
