import React from 'react'
import { analysisWithDefaultsSelector } from 'Selectors/analyseSelectors'
import { connect } from 'react-redux'
import './Targets.css'
import withColours from 'Components/utils/withColours'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'

@connect(state => ({ analysis: analysisWithDefaultsSelector(state) }))
@withColours
export default class Targets extends React.Component {
	render() {
		let {
			title,
			nodeValue,
			unité: unit,
			dottedName
		} = this.props.analysis.targets[0]
		return (
			<div id="targets">
				<span className="icon">→</span>
				<span className="content">
					{/*<span className="title">{title}</span>
					{' : '} */}
					<span className="figure">
						<span className="value">{nodeValue}</span>{' '}
						<span className="unit">{unit}</span>
					</span>
					<Link
						title="Quel est calcul ?"
						style={{ color: this.props.colours.colour }}
						to={'/règle/' + dottedName}
						className="explanation">
						{emoji('📖')}
					</Link>
				</span>
			</div>
		)
	}
}
