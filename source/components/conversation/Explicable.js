import classNames from 'classnames'
import { findRuleByDottedName } from 'Engine/rules'
import React from 'react'
import { connect } from 'react-redux'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { EXPLAIN_VARIABLE } from '../../actions'
import withTracker from '../withTracker'
import './Explicable.css'

@connect(
	state => ({
		explained: state.explainedVariable,
		textColourOnWhite: state.themeColours.textColourOnWhite,
		flatRules: flatRulesSelector(state)
	}),
	dispatch => ({
		explain: variableName => dispatch({ type: EXPLAIN_VARIABLE, variableName })
	})
)
@withTracker
export default class Explicable extends React.Component {
	render() {
		let {
			flatRules,
			dottedName,
			explain,
			explained,
			tracker,
			textColourOnWhite
		} = this.props

		// Rien à expliquer ici, ce n'est pas une règle
		if (dottedName == null) return this.props.children

		let rule = findRuleByDottedName(flatRules, dottedName)

		if (rule.description == null) return this.props.children

		//TODO montrer les variables de type 'une possibilité'

		return (
			<span
				className={classNames('explicable', {
					explained: dottedName === explained
				})}>
				{this.props.children}
				<span
					className="icon"
					onClick={e => {
						tracker.push(['trackEvent', 'help', dottedName])
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
					}>
					<i className="fa fa-book" aria-hidden="true" />
				</span>
			</span>
		)
	}
}
