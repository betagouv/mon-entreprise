import { useMatch } from 'react-router-dom'

import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type ChoixStatut = RelativeSitePaths['assistants']['choix-du-statut']
type Step = keyof ChoixStatut

const stepOrder: readonly Step[] = [
	'recherche-activité',
	'détails-activité',
	'commune',
	'association',
	'associé',
	'rémunération',
	'statuts',
	'résultat',
] as const

export function useNextStep() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const localizedStep = useMatch(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)?.params.step
	if (!localizedStep) {
		return absoluteSitePaths.assistants['choix-du-statut'][stepOrder[0]]
	}

	const entries = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	) as [Step, ChoixStatut[Step]][]

	const [currentStep] =
		entries.find(([, value]) => value === localizedStep) ?? []

	const nextStep =
		stepOrder[currentStep ? stepOrder.indexOf(currentStep) + 1 : 0]
	console.log('huihuihi', nextStep)

	return absoluteSitePaths.assistants['choix-du-statut'][nextStep]
}
