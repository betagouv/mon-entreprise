import Controls from 'Components/Controls'
import Conversation from 'Components/conversation/Conversation'
import TargetSelection from 'Components/TargetSelection'
import React from 'react'
import emoji from 'react-easy-emoji'
import { connect } from 'react-redux'
import { firstStepCompletedSelector } from 'Selectors/analyseSelectors'

export default connect(state => ({
	firstStepCompleted: firstStepCompletedSelector(state)
}))(function Simulation({
	firstStepCompleted,
	explanations,
	customEndMessages
}) {
	return (
		<>
			<TargetSelection />
			{firstStepCompleted && (
				<>
					<Controls />
					<h2>{emoji('📝 ')}Votre simulation</h2>
					<>
						<Conversation customEndMessages={customEndMessages} />
						{explanations}
					</>
				</>
			)}
		</>
	)
})
