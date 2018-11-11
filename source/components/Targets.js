import React from 'react'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'

@connect(state => ({ analysis: analysisWithDefaultsSelector(state) }))
export default class Targets extends React.Component {
	render() {
		let { title, nodeValue } = this.props.analysis.targets[0]
		return (
			<div>
				<span className="targetTitle">{title}</span>{' '}
				<span className="targetValue">{nodeValue}</span>
			</div>
		)
	}
}
