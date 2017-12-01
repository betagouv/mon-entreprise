import R from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import './Results.css'
import '../engine/mecanismViews/Somme.css'
import { humanFigure } from './rule/RuleValueVignette'

import { capitalise0 } from '../utils'

// Filtered variables and rules can't be filtered in a uniform way, for now
let paidBy = which => R.pathEq(['explanation', 'cotisation', 'dû par'], which)
let filteredBy = which => R.pathEq(['cotisation', 'dû par'], which)

export let byName = branch => R.groupBy(R.prop('dottedName'), branch)

export let cell = (branch, payer, analysis) => {
	let row = byBranch(analysis)[branch],
		items = R.filter(
			item => paidBy(payer)(item) || filteredBy(payer)(item),
			row
		),
		values = R.map(R.prop('nodeValue'), items)

	return R.sum(values)
}

export let subCell = (row, name, payer) => {
	let cells = row[name],
		items = R.filter(
			item => paidBy(payer)(item) || filteredBy(payer)(item),
			cells
		),
		values = R.map(R.prop('nodeValue'), items)

	return R.sum(values)
}

export let byBranch = analysis => {
	let sal = analysis.dict['contrat salarié . cotisations salariales']
	let pat = analysis.dict['contrat salarié . cotisations patronales']

	let l1 = sal ? sal.explanation.formule.explanation.explanation : [],
		l2 = pat ? pat.explanation.formule.explanation.explanation : [],
		explanations = R.concat(l1, l2),
		byBranch = R.groupBy(
			R.pathOr('autre', ['explanation', 'cotisation', 'branche']),
			explanations
		)

	return byBranch
}

@withRouter
@connect(state => ({
	analysis: state.analysis,
	targetNames: state.targetNames,
	situationGate: state.situationGate
}))
export default class ResultsGrid extends Component {
	render() {
		let { analysis, situationGate } = this.props

		if (!analysis) return null

		let extract = x => (x && x.nodeValue) || 0,
			fromSituation = name => situationGate(name),
			fromEval = name => R.find(R.propEq('dottedName', name), analysis.targets),
			fromDict = name => analysis.dict[name],
			get = name =>
				extract(fromSituation(name) || fromEval(name) || fromDict(name))
		let results = byBranch(analysis),
			brut = get('contrat salarié . salaire brut'),
			net = get('contrat salarié . salaire net'),
			total = get('contrat salarié . salaire total')

		return (
			<div className="somme">
				<table>
					<thead>
						<tr>
							<td className="element"><span className="annotation">Salaire brut</span></td>
							<td colSpan="4" className="element" id="sommeBase">
								{humanFigure(2)(brut)}
							</td>
						</tr>
					</thead>
					<tbody>
						{R.keys(results).map(branch => {
							let props = { branch, values: results[branch], analysis }
							return <Row key={branch} {...props} />
						})}
						<tr>
							<td className="element" />
							<td className="operator">=</td>
							<td className="element">{humanFigure(2)(net)} <div className="annotation">Salaire net</div></td>
							<td className="operator">=</td>
							<td className="element">
								{humanFigure(2)(total)} <div className="annotation">Salaire total</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}

class Row extends Component {
	state = {
		folded: true
	}
	render() {
		let { branch, values, analysis } = this.props,
			detail = byName(values)

		let title = name => {
			let node = R.head(detail[name])
			return node.title || capitalise0(node.name)
		}

		let aggregateRow = () => {
			return this.state.folded ? (
				<tr onClick={() => this.setState({ folded: !this.state.folded })}>
					<td className="element">
						{capitalise0(branch)}&nbsp;<span className="unfoldIndication">
							▶
						</span>
					</td>
					<td className="operator">-</td>
					<td className="element">
						{humanFigure(2)(cell(branch, 'salarié', analysis))}
					</td>
					<td className="operator">+</td>
					<td className="element">
						{humanFigure(2)(cell(branch, 'employeur', analysis))}
					</td>
				</tr>
			) : (
				// unfolded
				<tr onClick={() => this.setState({ folded: !this.state.folded })}>
					<td className="element">
						{capitalise0(branch)}&nbsp;<span className="unfoldIndication">
							▽'
						</span>
					</td>
					<td colSpan="4" />
				</tr>
			)
		}

		let detailRows = () => {
			return this.state.folded
				? []
				: R.keys(detail).map(subCellName => (
					<tr>
						<td className="element name">&nbsp;{title(subCellName)}</td>
						<td className="operator">-</td>
						<td className="element">
							{humanFigure(2)(subCell(detail, subCellName, 'salarié'))}
						</td>
						<td className="operator">+</td>
						<td className="element">
							{humanFigure(2)(subCell(detail, subCellName, 'employeur'))}
						</td>
					</tr>
				))
		}

		// returns an array of <tr>
		return R.concat([aggregateRow()], detailRows())
	}
}
