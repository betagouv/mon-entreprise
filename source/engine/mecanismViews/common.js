import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { pick, contains } from 'ramda'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { encodeRuleName, findRuleByDottedName } from '../rules'
import { capitalise0 } from '../../utils'
import withLanguage from '../../components/withLanguage'

let treatValue = (data, language) =>
	data == null
		? '?'
		: typeof data == 'boolean'
			? { true: '✔', false: '✘' }[data]
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
						<span className="name" data-term-definition={termDefinition}>
							<Trans>{name}</Trans>
						</span>
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
@connect(pick(['flatRules']))
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
