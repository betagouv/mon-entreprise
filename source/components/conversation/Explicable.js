import React from 'react'
import classNames from 'classnames'
import './Explicable.css'
import HoverDecorator from '../HoverDecorator'
import {connect} from 'react-redux'
import {EXPLAIN_VARIABLE} from '../../actions'
import {findRuleByDottedName} from '../../engine/rules'


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
			} = this.props,
			rule = findRuleByDottedName(dottedName)

		// Rien à expliquer ici, ce n'est pas une règle
		if (!rule) return <span>{label}</span>

		let ruleLabel = label || rule.titre || rule.name

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
					onClick={e => {e.preventDefault(); e.stopPropagation(); explain(dottedName)}}>
					<i className="fa fa-info" aria-hidden="true"></i>
				</span>
			</span>
		)
	}
}
