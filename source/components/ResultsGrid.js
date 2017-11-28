import R from 'ramda'
import React, { Component } from 'react'
import classNames from 'classnames'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import {clearDict} from 'Engine/traverse'
import {encodeRuleName} from 'Engine/rules'
import RuleValueVignette from './rule/RuleValueVignette'

export let branches = (parsedRules, analysis) => {
	let sal = analysis.dict['contrat salarié . cotisations salariales']
	let pat = analysis.dict['contrat salarié . cotisations patronales']

	let l1 = sal ? sal.explanation.formule.explanation.explanation : []
	let l2 = pat ? pat.explanation.formule.explanation.explanation : []

	let explanations = R.concat(l1, l2),
		names = R.map(R.pathOr('autre',['explanation','cotisation','branche']), explanations),
		result = R.uniq(names)

	return result
}

@withRouter
@connect(
	state => ({
		analysis: state.analysis,
		targetNames: state.targetNames,
	})
)
export default class ResultsGrid extends Component {
	render() {
		let {
			analysis,
			targetNames,
			location
		} = this.props

		if (!analysis) return null

		return (
			<table>
				<thead>
					<td class="blank indent"></td>
					<td class="blank indent">Branche</td>
					<td class="blank indent">Part salarié</td>
					<td class="blank indent">Part employeur</td>
				</thead>
				<tbody></tbody>
			</table>
		)
	}
}
