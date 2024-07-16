import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import Progress from '@/components/ui/Progress'
import { Button } from '@/design-system/buttons'
import { H3 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { useSimulationProgress } from '@/hooks/useSimulationProgress'
import { entrepriseEstSélectionnéeSelector } from '@/store/selectors/entrepriseEstSélectionnée.selector'

import EntrepriseInput from '../conversation/EntrepriseInput'

const QuestionsContainer = styled.div`
	padding: ${({ theme }) => ` ${theme.spacings.xs} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) =>
		`0 0 ${theme.box.borderRadius} ${theme.box.borderRadius}`};
	background-color: ${({ theme }) =>
		theme.darkMode
			? theme.colors.extended.grey[700]
			: theme.colors.extended.grey[100]};
	box-shadow: ${({ theme }) => theme.elevations[2]};
`

const Notice = styled(Body)`
	margin-bottom: -1rem;
`

export function Questions({
	customEndMessages,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
}) {
	const { numberCurrentStep, numberSteps } = useSimulationProgress()
	const { t } = useTranslation()

	const [companySelectionStep, setCompanySelectionStep] = useState(true)
	const entrepriseEstSélectionnée = useSelector(
		entrepriseEstSélectionnéeSelector
	)

	const handleGoToNext = useCallback(() => {
		setCompanySelectionStep(false)
	}, [])

	return companySelectionStep ? (
		<>
			<QuestionsContainer>
				<div className="print-hidden">
					<Notice>
						{t(
							'simulateurs.précision.company',
							'Améliorez votre simulation en sélectionnant votre entreprise :'
						)}
					</Notice>
				</div>
				<H3 id="questionHeader" as="h2">
					{t('Votre entreprise')}
				</H3>
				<legend className="sr-only">
					{t('Sélectionnez votre entreprise afin de préciser votre résultat.')}
				</legend>
				<EntrepriseInput aria-labelledby="questionHeader" />
				<Button
					size="XS"
					onPress={handleGoToNext}
					light={!entrepriseEstSélectionnée ? true : undefined}
					aria-label={
						entrepriseEstSélectionnée
							? t(
									"Suivant, passer aux questions avec l'entreprise sélectionnée"
							  )
							: t("Passer, passer aux questions sans sélectionner d'entreprise")
					}
				>
					{entrepriseEstSélectionnée ? (
						<Trans>Suivant</Trans>
					) : (
						<Trans>Passer</Trans>
					)}{' '}
					<span aria-hidden>→</span>
				</Button>
			</QuestionsContainer>
		</>
	) : (
		<>
			<Progress progress={numberCurrentStep} maxValue={numberSteps + 1} />
			<QuestionsContainer>
				<div className="print-hidden">
					{numberCurrentStep < numberSteps && (
						<Notice>
							{t(
								'simulateurs.précision.défaut',
								'Améliorez votre simulation en répondant aux questions :'
							)}
						</Notice>
					)}
				</div>
				<Conversation
					customEndMessages={customEndMessages}
					setCompanySelectionStep={setCompanySelectionStep}
				/>
			</QuestionsContainer>
		</>
	)
}
