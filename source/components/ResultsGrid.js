import {
	curry,
	evolve,
	path,
	propEq,
	pathEq,
	groupBy,
	prop,
	map,
	mapObjIndexed,
	sum,
	filter,
	concat,
	pathOr,
	toPairs,
	keys,
	head,
	find
} from 'ramda'
import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { formValueSelector } from 'redux-form'
import './Results.css'
import '../engine/mecanismViews/Somme.css'

import { capitalise0, humanFigure } from '../utils'
import { nameLeaf, encodeRuleName, findRuleByDottedName } from 'Engine/rules'

// Filtered variables and rules can't be filtered in a uniform way, for now
let paidBy = payer => item =>
	pathEq(['explanation', item.explanation.type, 'dû par'], payer, item)
let filteredBy = pathEq(['cotisation', 'dû par'])
export let byName = groupBy(prop('dottedName'))

export let cell = (branch, payer, analysis) => {
	let row = byBranch(analysis)[branch],
		items = filter(item => paidBy(payer)(item) || filteredBy(payer)(item), row),
		values = map(prop('nodeValue'), items)

	return sum(values)
}

export let subCell = (row, name, payer) => {
	let cells = row[name],
		items = filter(
			item => paidBy(payer)(item) || filteredBy(payer)(item),
			cells
		),
		values = map(prop('nodeValue'), items)

	return sum(values)
}

export let byBranch = analysis => {
	let sal = analysis.cache['contrat salarié . cotisations salariales']
	let pat = analysis.cache['contrat salarié . cotisations patronales']

	let l1 = sal ? sal.explanation.formule.explanation.explanation : [],
		l2 = pat ? pat.explanation.formule.explanation.explanation : [],
		explanations = concat(l1, l2),
		result = groupBy(
			pathOr('autre', ['explanation', 'cotisation', 'branche']),
			explanations
		)

	return result
}

@withRouter
@connect(state => ({
	analysis: state.analysis,
	targetNames: state.targetNames,
	situationGate: state.situationGate,
	inversions: formValueSelector('conversation')(state, 'inversions'),
	done: state.done,
	flatRules: state.flatRules
}))
@translate()
export default class ResultsGrid extends Component {
	render() {
		let {
				analysis,
				situationGate,
				targetNames,
				inversions,
				done,
				flatRules
			} = this.props,
			rules = flatRules

		if (!done) return null

		if (!analysis) return null

		let extract = x => (typeof x == 'string' ? +x : (x && x.nodeValue) || 0),
			fromEval = name => find(propEq('dottedName', name), analysis.targets),
			fromDict = name => analysis.cache[name],
			get = name =>
				extract(situationGate(name) || fromEval(name) || fromDict(name))
		let results = byBranch(analysis),
			brut = get('contrat salarié . salaire brut'),
			net = get('contrat salarié . salaire net'),
			total = get('contrat salarié . salaire total')
		let inversion = path(['contrat salarié ', ' salaire de base'], inversions),
			relevantSalaries = new Set(
				targetNames
					.concat(inversion ? [nameLeaf(inversion)] : [])
					.concat(['salaire de base'])
			)

		return (
			<div className="somme resultsGrid">
				<table>
					<thead>
						<tr>
							<td className="element" />
							<td
								colSpan={(relevantSalaries.size - 1) * 2}
								className="element value"
								id="sommeBase">
								{humanFigure(2)(brut)}{' '}
								<span className="annotation">
									<Trans>Salaire brut</Trans>
								</span>
							</td>
						</tr>
					</thead>
					<tbody>
						{toPairs(results).map(([branch, values]) => {
							let props = {
								key: branch,
								branch,
								values,
								analysis,
								rules,
								relevantSalaries
							}
							return <Row {...props} />
						})}
						<ReductionRow
							node={fromDict('contrat salarié . réductions de cotisations')}
							relevantSalaries={relevantSalaries}
						/>
						<tr>
							<td key="blank" className="element" />
							{relevantSalaries.has('salaire net') && (
								<>
									<td key="netOperator" className="operator">
										=
									</td>
									<td key="net" className="element value">
										{humanFigure(2)(net)}{' '}
										<span className="annotation">
											<Trans>Salaire net</Trans>
										</span>
									</td>
								</>
							)}
							{relevantSalaries.has('salaire total') && [
								<td key="totalOperator" className="operator">
									=
								</td>,
								<td key="total" className="element value">
									{humanFigure(2)(total)}{' '}
									<span className="annotation">
										<Trans>Salaire total</Trans>
									</span>
								</td>
							]}
						</tr>
					</tbody>
				</table>
			</div>
		)
	}
}

@translate()
class Row extends Component {
	static contextTypes = {
		i18n: PropTypes.object.isRequired
	}
	state = {
		folded: true
	}
	render() {
		let { rules, branch, values, analysis, relevantSalaries } = this.props,
			detail = byName(values),
			ruleData = mapObjIndexed(
				(v, k, o) => findRuleByDottedName(rules, k),
				detail
			),
			{ i18n } = this.context

		let title = name => {
			let node = ruleData[name]
			return node.title || capitalise0(i18n.t(node.name))
		}

		let aggregateRow = (
			<tr
				key="aggregateRow"
				onClick={() => this.setState({ folded: !this.state.folded })}>
				<td key="category" className="element category name">
					{capitalise0(i18n.t(branch))}&nbsp;<span className="unfoldIndication">
						{this.state.folded ? i18n.t('déplier') + ' >' : i18n.t('replier')}
					</span>
				</td>
				{this.state.folded ? (
					<>
						{relevantSalaries.has('salaire net') && (
							<>
								<td key="operator1" className="operator">
									-
								</td>
								<td key="value1" className="element value">
									{humanFigure(2)(cell(branch, 'salarié', analysis))}
								</td>
							</>
						)}
						{relevantSalaries.has('salaire total') && (
							<>
								<td key="operator2" className="operator">
									+
								</td>
								<td key="value2" className="element value">
									{humanFigure(2)(cell(branch, 'employeur', analysis))}
								</td>
							</>
						)}
					</>
				) : (
					<td key="blank" colSpan="4" />
				)}
			</tr>
		)

		let detailRows = this.state.folded
			? []
			: keys(detail).map(subCellName => (
					<tr key={'detailsRow' + subCellName} className="detailsRow">
						<td className="element name">
							<Link to={'/règle/' + encodeRuleName(nameLeaf(subCellName))}>
								{title(subCellName)}
							</Link>
						</td>
						{relevantSalaries.has('salaire net') && (
							<>
								<td key="operator1" className="operator">
									-
								</td>
								<td key="value1" className="element value">
									{humanFigure(2)(subCell(detail, subCellName, 'salarié'))}
								</td>
							</>
						)}
						{relevantSalaries.has('salaire total') && (
							<>
								<td key="operator2" className="operator">
									+
								</td>
								<td key="value2" className="element value">
									{humanFigure(2)(subCell(detail, subCellName, 'employeur'))}
								</td>
							</>
						)}
					</tr>
			  ))

		// returns an array of <tr>
		return concat([aggregateRow], detailRows)
	}
}

// TODO Ce code est beaucoup trop spécifique
// C'est essentiellement une copie de Row
class ReductionRow extends Component {
	state = {
		folded: true
	}
	render() {
		let { relevantSalaries, node } = this.props
		if (!relevantSalaries.has('salaire total')) return null
		let value = node ? node.nodeValue : 0
		let aggregateRow = (
			<tr
				key="aggregateRowReductions"
				onClick={() => this.setState({ folded: !this.state.folded })}>
				<td key="category" className="element category name">
					<Trans>Réductions</Trans>&nbsp;<span className="unfoldIndication">
						{this.state.folded ? 'déplier >' : 'replier'}
					</span>
				</td>
				{this.state.folded ? (
					<>
						{relevantSalaries.has('salaire net') && (
							<>
								<td key="operator1" className="operator">
									+
								</td>
								<td key="value1" className="element value">
									{humanFigure(2)(0)}
								</td>
							</>
						)}
						{relevantSalaries.has('salaire total') && (
							<>
								<td key="operator2" className="operator">
									-
								</td>
								<td key="value2" className="element value">
									{humanFigure(2)(value)}
								</td>
							</>
						)}
					</>
				) : (
					<td key="blank" colSpan="4" />
				)}
			</tr>
		)

		let detailRow = this.state.folded ? null : (
			<tr key="detailsRowRéductions" className="detailsRow">
				<td className="element name">
					<Link to={'/règle/' + encodeRuleName('réductions de cotisations')}>
						Réductions de cotisations
					</Link>
				</td>
				{relevantSalaries.has('salaire net') && (
					<>
						<td key="operator1" className="operator">
							+
						</td>
						<td key="value1" className="element value">
							{humanFigure(2)(0)}
						</td>
					</>
				)}
				{relevantSalaries.has('salaire total') && (
					<>
						<td key="operator2" className="operator">
							-
						</td>
						<td key="value2" className="element value">
							{humanFigure(2)(value)}
						</td>
					</>
				)}
			</tr>
		)

		// returns an array of <tr>
		return [aggregateRow, detailRow]
	}
}
