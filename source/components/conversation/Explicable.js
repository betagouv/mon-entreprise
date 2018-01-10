import React from 'react'
import classNames from 'classnames'
import './Explicable.css'
import { connect } from 'react-redux'
import { EXPLAIN_VARIABLE } from '../../actions'
import { rules, findRuleByDottedName } from 'Engine/rules'

import ReactPiwik from '../Tracker'

@connect(
	state => ({
		explained: state.explainedVariable,
		textColourOnWhite: state.themeColours.textColourOnWhite
	}),
	dispatch => ({
		explain: variableName => dispatch({ type: EXPLAIN_VARIABLE, variableName })
	})
)
export default class Explicable extends React.Component {
	render() {
		let { dottedName, explain, explained, textColourOnWhite } = this.props

		// Rien à expliquer ici, ce n'est pas une règle
		if (dottedName == null) return this.props.children

		let rule = findRuleByDottedName(rules, dottedName)

		if (rule.description == null) return this.props.children

		//TODO montrer les variables de type 'une possibilité'

		return (
			<span
				className={classNames('explicable', {
					explained: dottedName === explained
				})}
			>
				{this.props.children}
				<span
					className="icon"
					onClick={() => {
						ReactPiwik.push(['trackEvent', 'help', dottedName])
						explain(dottedName)
					}}
					style={
						dottedName === explained
							? {
									opacity: 1,
									background: textColourOnWhite,
									color: 'white'
								}
							: { color: textColourOnWhite }
					}
				>
					<i className="fa fa-book" aria-hidden="true" />
				</span>
			</span>
		)
	}
}
