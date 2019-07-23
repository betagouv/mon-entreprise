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

export let NodeValuePointer = ({ data, unit, equalSign }) => (
	<span
		className={classnames('situationValue', {
			boolean: typeof data == 'boolean'
		})}
		css={`
			background: white;
			border-bottom: 0 !important;
			padding: 0 0.2rem;
			text-decoration: none !important;
			font-size: 80%;
			box-shadow: 2px 2px 4px 1px #d9d9d9, 0 0 0 1px #d9d9d9;
			line-height: 1.6em;
			border-radius: 0.2rem;
		`}>
		{equalSign && <span>=&nbsp;</span>}
		<Value nodeValue={data} unit={unit} />
	</span>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export class Node extends Component {
	render() {
		let { classes, name, value, child, inline, unit } = this.props,
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
							<NodeValuePointer equalSign data={value} unit={unit} />
						</div>
					)
				) : (
					<span
						css={`
							@media (max-width: 1200px) {
								width: 100%;
								text-align: right;
							}
						`}>
						{value !== true && value !== false && !isNil(value) && (
							<span className="operator"> =&nbsp;</span>
						)}
						<NodeValuePointer data={value} unit={unit} />
					</span>
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
					nodeValue,
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
								</span>
							</Link>
							{!isNil(nodeValue) && (
								<span
									css={`
										margin: 0 0.3rem;
									`}>
									<NodeValuePointer data={nodeValue} unit={unit} />
								</span>
							)}
						</span>
					)}
				</span>
			)
		}
	}
)

export function SimpleRuleLink({ rule: { dottedName, title, name } }) {
	return (
		<Link to={'/documentation/' + encodeRuleName(dottedName)}>
			<span className="name">{title || capitalise0(name)}</span>
		</Link>
	)
}

export let sortObjectByKeys = pipe(
	toPairs,
	// we don't rely on the sorting of objects
	sort(([k1], [k2]) => k1 - k2)
)
