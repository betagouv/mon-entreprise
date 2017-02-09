import React from 'react'
import classNames from 'classnames'
import './Explicable.css'
import HoverDecorator from '../HoverDecorator'
import {connect} from 'react-redux'
import {EXPLAIN_VARIABLE} from '../../actions'
import {findRuleByName} from '../../engine/rules'


@connect(state => ({explained: state.explainedVariable}), dispatch => ({
	explain: variableName => dispatch({type: EXPLAIN_VARIABLE, variableName})
}))
@HoverDecorator
export default class Explicable extends React.Component {
	render(){
		let
			{name, hover, label, explain, explained} = this.props,
			rule = findRuleByName(name)

		// Rien à expliquer ici, ce n'est pas une règle
		if (!rule) return <span>{label}</span>

		let ruleLabel = rule.titre || rule.name
		// Rien à expliquer ici, il n'y a pas de champ description dans la règle
		if (!rule.description && !rule['choix exclusifs']) return <span>{ruleLabel}</span>


		return (
			<span
				className={classNames('explicable', {explained: name === explained})} >
				{ruleLabel}
				<span
					className="icon"
					onClick={e => {e.preventDefault(); e.stopPropagation(); explain(name)}}>
				{ hover ? 'ℹ' : '•' }</span>
			</span>
		)
	}
}
