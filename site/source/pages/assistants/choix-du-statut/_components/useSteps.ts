import { useMemo } from 'react'

import { useNavigation } from '@/lib/navigation'
import { RelativeSitePaths, useSitePaths } from '@/sitePaths'

type ChoixStatut = RelativeSitePaths['assistants']['choix-du-statut']
type Step = Exclude<keyof ChoixStatut, 'résultat'>

export type Statuts = Exclude<keyof ChoixStatut['résultat'], 'index'>

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

export function lastPathSegment(path: string): string | undefined {
	return path.split('/').filter(Boolean).at(-1)
}

export function useCurrentStep() {
	const { relativeSitePaths } = useSitePaths()
	const { currentPath } = useNavigation()
	const segment = lastPathSegment(currentPath)

	if (!segment) {
		return 'index'
	}

	const entries = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	) as [Step, ChoixStatut[Step]][]

	const [currentStep] =
		entries.find(
			([, value]) => typeof value === 'string' && value === segment
		) ?? []

	return currentStep ?? 'index'
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

/**
 * Retourne les chemins relatifs vers les étapes et résultats de l'assistant.
 * Fonctionne quel que soit le préfixe d'URL (/iframes/ ou /assistants/).
 */
export function useStepPaths() {
	const { relativeSitePaths } = useSitePaths()
	const paths = relativeSitePaths.assistants['choix-du-statut']
	const currentStep = useCurrentStep()
	const isAtIndex = currentStep === 'index'

	return useMemo(() => {
		const toStep = (step: Step | undefined): string => {
			if (!step || step === 'index') {
				return isAtIndex ? '.' : '..'
			}

			const segment = paths[step] as string

			return isAtIndex ? segment : `../${segment}`
		}

		const toResult = (statut: Statuts): string =>
			`${isAtIndex ? '' : '../'}${paths.résultat.index}/${
				paths.résultat[statut]
			}`

		return { toStep, toResult }
	}, [paths, isAtIndex])
}
