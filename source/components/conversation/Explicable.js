import React from 'react'
import classNames from 'classnames'
import './Explicable.css'
import { connect } from 'react-redux'
import { EXPLAIN_VARIABLE } from '../../actions'
import { findRuleByDottedName } from 'Engine/rules'

import ReactPiwik from '../Tracker'

@connect(
	state => ({
		explained: state.explainedVariable,
		textColourOnWhite: state.themeColours.textColourOnWhite,
		flatRules: state.flatRules
	}),
	dispatch => ({
		explain: variableName => dispatch({ type: EXPLAIN_VARIABLE, variableName })
	})
)
export default class Explicable extends React.Component {
	render() {
		let { flatRules, dottedName, explain, explained, textColourOnWhite } = this.props

		// Rien à expliquer ici, ce n'est pas une règle
		if (dottedName == null) return this.props.children

		let rule = findRuleByDottedName(flatRules, dottedName)

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
					onClick={e => {
						ReactPiwik.push(['trackEvent', 'help', dottedName])
						explain(dottedName)
						e.preventDefault()
						e.stopPropagation()
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
