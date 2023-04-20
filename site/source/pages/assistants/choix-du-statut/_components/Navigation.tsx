import { Trans, useTranslation } from 'react-i18next'
import { useMatch } from 'react-router-dom'

import { Button } from '@/design-system/buttons'
import { useSitePaths } from '@/sitePaths'

export const stepOrder = [
	'activité',
	'département',
	'lucratif',
	'associé',
	'rémunération',
	'statuts',
	'résultat',
] as const

type Step = (typeof stepOrder)[number]

function useCurrentStep() {
	const { relativeSitePaths, absoluteSitePaths } = useSitePaths()
	const localizedStep = useMatch(
		`${absoluteSitePaths.assistants['choix-du-statut'].index}/:step`
	)?.params.step
	if (!localizedStep) {
		return null
	}

	const currentStep = Object.entries(
		relativeSitePaths.assistants['choix-du-statut']
	).find(
		([, value]) => value === localizedStep
	)?.[0] as keyof (typeof relativeSitePaths.assistants)['choix-du-statut']

	if (!stepOrder.includes(currentStep as Step)) {
		return null
	}

	return currentStep as Step
}

export default function Navigation({
	currentStepIsComplete,
}: {
	currentStepIsComplete: boolean
}) {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	const currentStep = useCurrentStep()
	if (!currentStep) {
		return null
	}
	const nextStep = stepOrder[stepOrder.indexOf(currentStep) + 1]
	const previousStep = stepOrder[stepOrder.indexOf(currentStep) - 1]

	return (
		<>
			<Button
				size="XS"
				to={
					absoluteSitePaths.assistants['choix-du-statut'][
						previousStep || 'index'
					]
				}
			>
				<span aria-hidden>←</span> <Trans>Précédent</Trans>
			</Button>

			{nextStep && (
				<Button
					size="XS"
					to={absoluteSitePaths.assistants['choix-du-statut'][nextStep]}
					isDisabled={!currentStepIsComplete}
					light
					color={'secondary'}
					aria-label={t("Suivant, passer à l'étape suivante")}
				>
					<Trans>Suivant</Trans>

					<span aria-hidden>→</span>
				</Button>
			)}
		</>
	)
}
