import { default as classNames, default as classnames } from 'classnames'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import Value, { ValueProps } from 'Components/Value'
import { contains, isNil, pipe, sort, toPairs } from 'ramda'
import React, { useContext } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { parsedRulesSelector } from 'Selectors/analyseSelectors'
import { DottedName, Rule } from 'Types/rule'
import { LinkButton } from 'Ui/Button'
import { capitalise0 } from '../../utils'
import { encodeRuleName } from '../ruleUtils'
import mecanismColors from './colors'

type NodeValuePointerProps = {
	data: ValueProps['nodeValue']
	unit: ValueProps['unit']
}

export let NodeValuePointer = ({ data, unit }: NodeValuePointerProps) => (
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
		`}
	>
		<Value nodeValue={data} unit={unit} />
	</span>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
type NodeProps = {
	classes: string
	name: string
	value: NodeValuePointerProps['data']
	unit: NodeValuePointerProps['unit']
	inline?: boolean
	children: React.ReactNode
}

export function Node({
	classes,
	name,
	value,
	children,
	inline,
	unit
}: NodeProps) {
	let termDefinition = contains('mecanism', classes) && name

	return (
		<div
			className={classNames(classes, 'node', { inline })}
			style={termDefinition ? { borderColor: mecanismColors(name) } : {}}
		>
			{name && !inline && (
				<div className="nodeHead" css="margin-bottom: 1em">
					<LinkButton
						className="name"
						style={termDefinition ? { background: mecanismColors(name) } : {}}
						data-term-definition={termDefinition}
					>
						<Trans>{name}</Trans>
					</LinkButton>
				</div>
			)}
			{children}{' '}
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
					`}
				>
					{(value as any) !== true &&
						(value as any) !== false &&
						!isNil(value) && <span className="operator"> =&nbsp;</span>}
					<NodeValuePointer data={value} unit={unit} />
				</span>
			)}
		</div>
	)
}

export function InlineMecanism({ name }: { name: string }) {
	return (
		<span className="inlineMecanism">
			<LinkButton
				className="name"
				data-term-definition={name}
				style={{ background: mecanismColors(name) }}
			>
				<Trans>{name}</Trans>
			</LinkButton>
		</span>
	)
}

type LeafProps = {
	classes: string
	dottedName: DottedName
	name: string
	nodeValue: NodeValuePointerProps['data']
	filter: string
	unit: NodeValuePointerProps['unit']
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export function Leaf({
	classes,
	dottedName,
	name,
	nodeValue,
	filter,
	unit
}: LeafProps) {
	const sitePaths = useContext(SitePathsContext)
	const rules = useSelector(parsedRulesSelector)
	let rule = rules[dottedName]
	const title = rule.title || capitalise0(name)
	return (
		<span className={classNames(classes, 'leaf')}>
			{dottedName && (
				<span className="nodeHead">
					<Link to={sitePaths.documentation.rule(dottedName)}>
						<span className="name">
							{rule.acronyme ? (
								<abbr title={title}>{rule.acronyme}</abbr>
							) : (
								title
							)}{' '}
							{filter}
						</span>
					</Link>
					{!isNil(nodeValue) && (
						<span
							css={`
								margin: 0 0.3rem;
							`}
						>
							<NodeValuePointer data={nodeValue} unit={unit} />
						</span>
					)}
				</span>
			)}
		</span>
	)
}

type SimpleRuleLinkProps = { rule: Rule }

export function SimpleRuleLink({
	rule: { dottedName, title, name }
}: SimpleRuleLinkProps) {
	return (
		<Link to={'/documentation/' + encodeRuleName(dottedName)}>
			<span className="name">{title || capitalise0(name)}</span>
		</Link>
	)
}

export let sortObjectByKeys = pipe(
	toPairs as any,
	// we don't rely on the sorting of objects
	sort(([k1]: [number], [k2]: [number]) => k1 - k2)
)
