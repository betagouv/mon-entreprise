import React, { Component } from 'react'
import {connect} from 'react-redux'
import {usedVariables} from '../selectors'


let mapStateToProps = state => (
	{
		usedVariables: usedVariables(state)
	}
)


@connect(mapStateToProps)
export default class Analyse extends Component {
	render() {
		let {usedVariables} = this.props,
			calculable = usedVariables[5].calculable

			For each of these cases, extract used variables. Regexp, remove accents, list of variables.
			check
			count all


		let scalarMult = value => {
			let [match, multiple, variable] = value.match(/(?:([0-9])*\s\*\s)?((?:[a-z]|\s|_)+)/g)
		}

		let possibilities = {
			linear: {
				base: 'scalar mult',
				limit: 'scalar mult',
				historique: null,
				// VAR/case: logic predicate
			},
			marginalRateTaxScale: {
				base: 'scalar mult',
				// VAR/case: logic predicate
			},
			concerne: 'logic',
			'ne concerne pas': 'logic',
			logique: 'logic', // predicates leading to a boolean,
			'logique numérique': 'numeric logic', // predicates leading to a number

			/*
			logic = string ? logic predicate -> & the rest
			|| list of string predicates : ||
			*/
		}







		console.log(calculable);

		return (<div>Analyse</div>)
	}
}
