import { T } from 'Components'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import PageFeedback from 'Components/Feedback/PageFeedback'
import SearchButton from 'Components/SearchButton'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { useSelector } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/analyseSelectors'
import { simulationProgressSelector } from 'Selectors/progressSelectors'
import * as Animate from 'Ui/animate'
import Progress from 'Ui/Progress'

type SimulationProps = {
	explanations: React.ReactNode
	customEndMessages?: ConversationProps['customEndMessages']
}

export default function Simulation({
	explanations,
	customEndMessages,
	customEnd,
	targets,
	showConversation,
	noFeedback,
	noProgressMessage,
}: SimulationProps) {
	const firstStepCompleted = useSelector(firstStepCompletedSelector)
	const progress = useSelector(simulationProgressSelector)
	return (
		<>
			{targets || <TargetSelection />}
			<SearchButton invisibleButton />
			{(showConversation || firstStepCompleted) && (
				<>
					<Animate.fromTop>
						<Conversation
							customEnd={customEnd}
							customEndMessages={customEndMessages}
						/>
						{progress < 1 && (
							<Progress progress={progress} className="ui__ full-width" />
						)}
						<br />
						{!noFeedback && (
							<PageFeedback
								customMessage={
									<T k="feedback.simulator">
										Êtes-vous satisfait de ce simulateur ?
									</T>
								}
								customEventName="rate simulator"
							/>
						)}
						{explanations}
					</Animate.fromTop>
				</>
			)}
		</>
	)
}
