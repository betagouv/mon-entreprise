import { default as classNames, default as classnames } from 'classnames'
import withSitePaths from 'Components/utils/withSitePaths'
import Value from 'Components/Value'
import { compose, contains, isNil, pipe, sort, toPairs } from 'ramda'
import React, { createContext, useContext } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { flatRulesSelector } from 'Selectors/analyseSelectors'
import { LinkButton } from 'Ui/Button'
import { capitalise0 } from '../../utils'
import { encodeRuleName, findRuleByDottedName } from '../rules'
import mecanismColours from './colours'

export let NodeValuePointer = ({ data, unit }) => (
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
		<Value nodeValue={data} unit={unit} />
	</span>
)

export const NodeTreeDepthContext = createContext(0)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export function Node({ classes, name, value, child, inline, unit }) {
	let termDefinition = contains('mecanism', classes) && name,
		nodeTreeDepth = useContext(NodeTreeDepthContext)

	return (
		<NodeTreeDepthContext.Provider value={nodeTreeDepth + 1}>
			<div
				className={classNames(classes, 'node', { inline })}
				style={termDefinition ? { borderColor: mecanismColours(name) } : {}}>
				{name && !inline && (
					<div className="nodeHead" css="margin-bottom: 1em">
						<LinkButton
							className="name"
							style={
								termDefinition ? { background: mecanismColours(name) } : {}
							}
							data-term-definition={termDefinition}>
							<Trans>{name}</Trans>
						</LinkButton>
					</div>
				)}
				{child}{' '}
				{name ? (
					!isNil(value) && (
						<div className="mecanism-result">
							<span css="font-size: 90%; margin: 0 .6em">=</span>
							<NodeValuePointer data={value} unit={unit} />
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
		</NodeTreeDepthContext.Provider>
	)
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
)(function Leaf({
	classes,
	dottedName,
	name,
	nodeValue,
	flatRules,
	filter,
	sitePaths,
	unit
}) {
	let rule = findRuleByDottedName(flatRules, dottedName)

	return (
		<span className={classNames(classes, 'leaf')}>
			{dottedName && (
				<span className="nodeHead">
					<Link
						to={
							sitePaths.documentation.index + '/' + encodeRuleName(dottedName)
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
})

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
