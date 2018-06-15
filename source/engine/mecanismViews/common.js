import classNames from 'classnames'
import { contains } from 'ramda'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withLanguage from '../../components/withLanguage'
import { capitalise0 } from '../../utils'
import { encodeRuleName, findRuleByDottedName } from '../rules'
import { flatRulesSelector } from 'Selectors/analyseSelectors'

let treatValue = (data, language) =>
	data == null
		? '?'
		: typeof data == 'boolean'
			? { true: '✅', false: '✘' }[data]
			: !isNaN(data)
				? Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(data)
				: data

export let NodeValue = withLanguage(({ data, language }) => (
	<span>{treatValue(data, language)}</span>
))

let NodeValuePointer = ({ data }) =>
	data !== undefined && data !== null ? (
		<span className={'situationValue ' + treatValue(data)}>
			<NodeValue data={data} />
		</span>
	) : null

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export class Node extends Component {
	render() {
		let { classes, name, value, child } = this.props,
			termDefinition = contains('mecanism', classes) && name

		return (
			<div className={classNames(classes, 'node')}>
				{name && (
					<span className="nodeHead">
						<button
							className="name unstyledButton"
							data-term-definition={termDefinition}>
							<Trans>{name}</Trans>
						</button>
						<NodeValuePointer data={value} />
					</span>
				)}
				{child}
				{!name && <NodeValuePointer data={value} />}
			</div>
		)
	}
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
@connect(state => ({ flatRules: flatRulesSelector(state) }))
export class Leaf extends Component {
	render() {
		let { classes, dottedName, name, value, flatRules } = this.props,
			rule = findRuleByDottedName(flatRules, dottedName)

		return (
			<span className={classNames(classes, 'leaf')}>
				{dottedName && (
					<span className="nodeHead">
						<Link to={'/règle/' + encodeRuleName(dottedName)}>
							<span className="name">
								{rule.title || capitalise0(name)}
								<NodeValuePointer data={value} />
							</span>
						</Link>
					</span>
				)}
			</span>
		)
	}
}
