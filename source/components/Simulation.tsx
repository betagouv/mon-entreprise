import { T } from 'Components'
import Controls from 'Components/Controls'
import Conversation, {
	ConversationProps,
} from 'Components/conversation/Conversation'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
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
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '1.2rem',
								marginBottom: '0.6rem',
								alignItems: 'baseline',
							}}
						>
							{progress < 1 && !noProgressMessage ? (
								<small css="padding: 0.4rem 0">
									<T k="simulateurs.précision.défaut">
										Affinez la simulation en répondant aux questions :
									</T>
								</small>
							) : (
								<span />
							)}
							<SeeAnswersButton />
						</div>
						<section
							css={'background: red !important;'}
							className="ui__ full-width lighter-bg"
						>
							<div className="ui__ container">
								<Controls />
								<Conversation
									customEnd={customEnd}
									customEndMessages={customEndMessages}
								/>
							</div>
						</section>
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
