import { WorkerEngine } from '@publicodes/worker-react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import Progress from '@/components/ui/Progress'
import { Body } from '@/design-system/typography/paragraphs'
import { useSimulationProgress } from '@/hooks/useNextQuestion'

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
	workerEngines,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
	workerEngines?: WorkerEngine[]
}) {
	const { numberCurrentStep, numberSteps } = useSimulationProgress()

	return (
		<>
			<Progress progress={numberCurrentStep} maxValue={numberSteps} />
			<QuestionsContainer>
				<div className="print-hidden">
					{numberCurrentStep < numberSteps && (
						<Notice>
							<Trans i18nKey="simulateurs.précision.défaut">
								Améliorez votre simulation en répondant aux questions :
							</Trans>
						</Notice>
					)}
				</div>
				<Conversation
					customEndMessages={customEndMessages}
					workerEngines={workerEngines}
				/>
			</QuestionsContainer>
		</>
	)
}
