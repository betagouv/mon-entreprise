import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import Conversation, {
	ConversationProps,
} from '@/components/conversation/Conversation'
import Progress from '@/components/ui/Progress'
import { Body } from '@/design-system/typography/paragraphs'

import { useSimulationProgress } from './../utils/useNextQuestion'

const QuestionsContainer = styled.div`
	padding: ${({ theme }) => ` ${theme.spacings.xs} ${theme.spacings.lg}`};
	border-radius: ${({ theme }) =>
		`0 0 ${theme.box.borderRadius} ${theme.box.borderRadius}`};
	background: ${({ theme }) => {
		const palettePrimary = theme.colors.bases.primary
		const paletteGrey = theme.colors.extended.grey

		return theme.darkMode
			? `linear-gradient(60deg, ${paletteGrey[800]} 0%, ${paletteGrey[700]} 100%);`
			: `linear-gradient(60deg, ${palettePrimary[200]} 0%, ${palettePrimary[100]} 100%);`
	}};
`

const Notice = styled(Body)`
	margin-bottom: -1rem;
`

export function Questions({
	customEndMessages,
	engines,
}: {
	customEndMessages?: ConversationProps['customEndMessages']
	engines?: Array<Engine<DottedName>>
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
				<Conversation customEndMessages={customEndMessages} engines={engines} />
			</QuestionsContainer>
		</>
	)
}
