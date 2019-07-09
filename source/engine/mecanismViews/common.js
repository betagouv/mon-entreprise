import classNames from 'classnames'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose, contains, isNil, pipe, sort, toPairs } from 'ramda'
import React, { Component } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import { capitalise0 } from '../../utils'
import { encodeRuleName, findRuleByDottedName } from '../rules'
import mecanismColours from './colours'
import classnames from 'classnames'
import Value from 'Components/Value'

//TODO remove this one, it should reside in 'Value.js'
export let formatNumber = (data, language) =>
	!isNaN(data)
		? Intl.NumberFormat(language, { maximumFractionDigits: 4 }).format(data)
		: data

export let NodeValuePointer = ({ data, unit }) => (
	<span
		className={classnames('situationValue', {
			boolean: typeof data == 'boolean'
		})}>
		<Value nodeValue={data} unit={unit} />
	</span>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export class Node extends Component {
	render() {
		let { classes, name, value, child, inline } = this.props,
			termDefinition = contains('mecanism', classes) && name

		return (
			<div
				className={classNames(classes, 'node', { inline })}
				style={termDefinition ? { borderColor: mecanismColours(name) } : {}}>
				{name && !inline && (
					<span className="nodeHead">
						<LinkButton
							className="name"
							style={
								termDefinition ? { background: mecanismColours(name) } : {}
							}
							data-term-definition={termDefinition}>
							<Trans>{name}</Trans>
						</LinkButton>
					</span>
				)}
				{child}{' '}
				{name ? (
					!isNil(value) && (
						<div className="mecanism-result">
							<NodeValuePointer data={value} />
						</div>
					)
				) : (
					<>
						{value !== true && value !== false && !isNil(value) && (
							<span className="operator"> = </span>
						)}
						<NodeValuePointer data={value} />
					</>
				)}
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
export const Leaf = compose(
	withSitePaths,
	connect(state => ({ flatRules: flatRulesSelector(state) }))
)(
	class Leaf extends Component {
		render() {
			let {
					classes,
					dottedName,
					name,
					value,
					flatRules,
					filter,
					sitePaths,
					unit
				} = this.props,
				rule = findRuleByDottedName(flatRules, dottedName)

			return (
				<span className={classNames(classes, 'leaf')}>
					{dottedName && (
						<span className="nodeHead">
							<Link
								to={
									sitePaths.documentation.index +
									'/' +
									encodeRuleName(dottedName)
								}>
								<span className="name">
									{rule.title || capitalise0(name)} {filter}
									{!isNil(value) && (
										<NodeValuePointer data={value} unit={unit} />
									)}
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
		<Link to={encodeRuleName(dottedName)}>
			<span className="name">{title || capitalise0(name)}</span>
		</Link>
	)
}

export let sortObjectByKeys = pipe(
	toPairs,
	// we don't rely on the sorting of objects
	sort(([k1], [k2]) => k1 - k2)
)
