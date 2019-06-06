import Controls from 'Components/Controls'
import Conversation from 'Components/conversation/Conversation'
import ResultReliability from 'Components/conversation/ResultReliability'
import SeeAnswersButton from 'Components/conversation/SeeAnswersButton'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import { connect } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/analyseSelectors'
import { simulationProgressSelector } from 'Selectors/progressSelectors'
import * as Animate from 'Ui/animate'
import Progress from 'Ui/Progress'

export default connect(state => ({
	firstStepCompleted: firstStepCompletedSelector(state),
	progress: simulationProgressSelector(state)
}))(function Simulation({
	firstStepCompleted,
	explanations,
	customEndMessages,
	progress
}) {
	return (
		<>
			<TargetSelection />
			{firstStepCompleted && (
				<>
					<Animate.fromTop>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginTop: '1.2rem',
								marginBottom: '0.6rem',
								alignItems: 'flex-end'
							}}>
							<ResultReliability progress={progress} />
							<SeeAnswersButton />
						</div>
						<div className="ui__ full-width choice-group">
							<div className="ui__ container">
								<Controls />
								<Conversation customEndMessages={customEndMessages} />
							</div>
						</div>
						{progress < 1 && (
							<Progress progress={progress} className="ui__ full-width" />
						)}
						{explanations}
					</Animate.fromTop>
				</>
			)}
		</>
	)
})
