import classNames from 'classnames'
import withLanguage from 'Components/utils/withLanguage'
import { contains } from 'ramda'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import { capitalise0 } from '../../utils'
import { encodeRuleName, findRuleByDottedName } from '../rules'
import mecanismColours from './colours'

let treatValue = (data, language) =>
	data == null
		? '?'
		: typeof data == 'boolean'
		? { true: '✅', false: '✘' }[data]
		: formatNumber(data, language)

export let formatNumber = (data, language) =>
	!isNaN(data)
		? Intl.NumberFormat(language, { maximumFractionDigits: 2 }).format(data)
		: data

export let NodeValue = withLanguage(({ data, language }) => (
	<span>{treatValue(data, language)}</span>
))

export let NodeValuePointer = ({ data }) =>
	data !== undefined && data !== null ? (
		<span className={'situationValue ' + treatValue(data)}>
			<NodeValue data={data} />
		</span>
	) : null

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export class Node extends Component {
	render() {
		let { classes, name, value, child, inline } = this.props,
			termDefinition = contains('mecanism', classes) && name

		return (
			<div
				className={classNames(classes, 'node', { inline })}
				style={termDefinition ? { borderColor: mecanismColours(name) } : {}}>
				{name && (
					<span className="nodeHead">
						{!inline && (
							<LinkButton
								className="name"
								style={
									termDefinition ? { background: mecanismColours(name) } : {}
								}
								data-term-definition={termDefinition}>
								<Trans>{name}</Trans>
							</LinkButton>
						)}
						<NodeValuePointer data={value} />
					</span>
				)}
				{child}
				{!name && <NodeValuePointer data={value} />}
			</div>
		)
	}
}

export function InlineMecanism({ name }) {
	return (
		<span className="inlineMecanism">
			<LinkButton
				className="name"
				data-term-definition={name}
				style={{ background: mecanismColours(name) }}>
				<Trans>{name}</Trans>
			</LinkButton>
		</span>
	)
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export const Leaf = connect(state => ({ flatRules: flatRulesSelector(state) }))(
	class Leaf extends Component {
		render() {
			let { classes, dottedName, name, value, flatRules, filter } = this.props,
				rule = findRuleByDottedName(flatRules, dottedName)

			return (
				<span className={classNames(classes, 'leaf')}>
					{dottedName && (
						<span className="nodeHead">
							<Link to={'../règle/' + encodeRuleName(dottedName)}>
								<span className="name">
									{rule.title || capitalise0(name)} {filter}
									<NodeValuePointer data={value} />
								</span>
							</Link>
						</span>
					)}
				</span>
			)
		}
	}
)

export function SimpleRuleLink({ rule: { dottedName, title, name } }) {
	return (
		<Link to={'../règle/' + encodeRuleName(dottedName)}>
			<span className="name">{title || capitalise0(name)}</span>
		</Link>
	)
}
