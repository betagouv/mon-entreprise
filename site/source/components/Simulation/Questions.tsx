import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import Progress from '@/components/ui/Progress'
import { Body } from '@/design-system/typography/paragraphs'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { useSimulationProgress } from './../utils/useNextQuestion'

const QuestionsContainer = styled.div`
	padding: ${({ theme }) => ` ${theme.spacings.xs} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) =>
		`0 0 ${theme.box.borderRadius} ${theme.box.borderRadius}`};
	background: ${({ theme }) => {
		const colorPalette = theme.colors.bases.primary
		return `linear-gradient(60deg, ${colorPalette[200]} 0%, ${colorPalette[100]} 100%);`
	}};
`

const Notice = styled(Body)`
	margin-bottom: -1rem;
`

export function Questions({
	customEndMessages,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
}) {
	const progress = useSimulationProgress()

	return (
		<>
			<Progress progress={progress} />
			<QuestionsContainer className="print-hidden">
				{progress < 1 && (
					<Notice>
						<Trans i18nKey="simulateurs.précision.défaut">
							Améliorez votre simulation en répondant aux questions :
						</Trans>
					</Notice>
				)}

				<Conversation customEndMessages={customEndMessages} />
			</QuestionsContainer>
		</>
	)
}
