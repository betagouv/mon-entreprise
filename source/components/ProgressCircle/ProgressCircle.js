import React from 'react'
import { Circle } from 'rc-progress'
import { targetCompletionRatioSelector } from './selector'
import { connect } from 'react-redux'

let ProgressCircle = ({ ratio, isActiveInput }) => (
	<span
		className="progressCircle"
		style={{
			visibility: isActiveInput ? 'hidden' : 'visible'
		}}>
		{ratio === 0 ? (
			<i className="fa fa-check" aria-hidden="true" />
		) : (
			<Circle
				percent={Math.max(2, 100 - ratio * 100)}
				strokeWidth="15"
				strokeColor="#5de662"
				trailColor="#fff"
				trailWidth="5"
			/>
		)}
	</span>
)

export default connect((state, props) => ({
	ratio: targetCompletionRatioSelector(state, props)
}))(ProgressCircle)
