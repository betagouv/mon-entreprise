import React from 'react'
import classNames from 'classnames'
import './Explicable.css'
import HoverDecorator from '../HoverDecorator'
import {connect} from 'react-redux'
import {EXPLAIN_VARIABLE} from '../../actions'
import {rules, findRuleByDottedName} from 'Engine/rules'

import ReactPiwik from '../Tracker';

@connect(state => ({explained: state.explainedVariable}), dispatch => ({
	explain: variableName => dispatch({type: EXPLAIN_VARIABLE, variableName})
}))
@HoverDecorator
export default class Explicable extends React.Component {
	render(){
		let {
			dottedName, hover, label,
			explain, explained,
			lightBackground
			} = this.props

		// Rien à expliquer ici, ce n'est pas une règle
		if (dottedName == null)
			return <span>{label}</span>

		let rule = findRuleByDottedName(rules, dottedName)


		let ruleLabel = (
			label || rule.title
		).replace(/\s\?$/g, '\u00a0?') // le possible ' ?' final est rendu insécable

		// Rien à expliquer ici, il n'y a pas de champ description dans la règle
		if (!rule.description)
			return <span>{ruleLabel}</span>

		//TODO montrer les variables de type 'une possibilité'


		return (
			<span
				className={classNames('explicable', {explained: dottedName === explained, dark: lightBackground})} >
					{ruleLabel}
				<span
					className="icon"
					onClick={e => {
						ReactPiwik.push(['trackEvent', 'help', dottedName]);
						e.preventDefault();
						e.stopPropagation();
						explain(dottedName)
					}}>
					<i className="fa fa-info" aria-hidden="true"></i>
				</span>
			</span>
		)
	}
}
