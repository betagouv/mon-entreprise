import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'

import { ScrollToTop } from '@/components/utils/Scroll'
import { Button } from '@/design-system/buttons'
import { useSitePaths } from '@/sitePaths'

import AfterRegistration from './AfterRegistration'
import AccueilChoixStatut from './choix-statut-juridique'
import GuideStatut from './GuideStatut'

type Step =
	| 'activité'
	| 'département'
	| 'lucratif'
	| 'associé'
	| 'rémunération'
	| 'statuts'
	| 'résultat'

const stepOrder: Step[] = [
	'activité',
	'département',
	'lucratif',
	'associé',
	'rémunération',
	'statuts',
	'résultat',
]

// map stepo

export const AssistantChoixStatut = () => {
	const { t } = useTranslation()
	const [currentStep, setCurrentStep] = useState<Step>('activité')

	const nextStep = useCallback(() => {
		setCurrentStep((step) => {
			const index = stepOrder.findIndex((s) => s === step)

			return stepOrder[index + 1] || stepOrder[index]
		})
	}, [])

	const prevStep = useCallback(() => {
		setCurrentStep((step) => {
			const index = stepOrder.findIndex((s) => s === step)

			return stepOrder[index - 1] || stepOrder[index]
		})
	}, [])

	return (
		<>
			{currentStep}

			<Button light onPress={prevStep} size="XS">
				<span aria-hidden>←</span> <Trans>Précédent</Trans>
			</Button>

			<Button
				size="XS"
				onPress={nextStep}
				light
				color={'secondary'}
				aria-label={
					t('Suivant, passer à la question suivante')
					// : t('Passer, passer la question sans répondre')
				}
			>
				{/* {currentQuestionIsAnswered ? ( */}
				<Trans>Suivant</Trans>
				{/* ) : (
					<Trans>Passer</Trans>
				)}{' '} */}
				<span aria-hidden>→</span>
			</Button>
		</>
	)
}

export default function ChoixDuStatut() {
	const { relativeSitePaths } = useSitePaths()
	const location = useLocation()

	return (
		<>
			<ScrollToTop key={location.pathname} />
			<Routes>
				<Route index element={<AccueilChoixStatut />} />
				{/* {LANDING_LEGAL_STATUS_LIST.map((statut) => ( */}
				<Route
					// key={statut}
					path={relativeSitePaths.assistants['choix-du-statut'].assistant}
					element={<AssistantChoixStatut />}
				/>
				{/* ))} */}
				<Route
					path={relativeSitePaths.assistants['choix-du-statut'].après}
					element={<AfterRegistration />}
				/>
				<Route
					path={
						relativeSitePaths.assistants['choix-du-statut'].guideStatut.index +
						'/*'
					}
					element={<GuideStatut />}
				/>
			</Routes>
		</>
	)
}
