import { default as classNames, default as classnames } from 'classnames'
import { contains, isNil } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { formatValue } from '../../format'
import { Evaluation, ParsedRule, Types, Unit } from '../../types'
import { capitalise0 } from '../../utils'
import { RuleLinkWithContext } from '../RuleLink'
import mecanismColors from './colors'

type NodeValuePointerProps = {
	data: Evaluation<Types>
	unit: Unit
}

export const NodeValuePointer = ({ data, unit }: NodeValuePointerProps) => (
	<span
		className={classnames('situationValue', {
			boolean: typeof data == 'boolean'
		})}
		style={{
			background: 'white',
			borderBottom: '0 !important',
			marginLeft: '0.4rem',
			padding: '0 0.2rem',
			textDecoration: 'none !important',
			boxShadow: '2px 2px 4px 1px #d9d9d9, 0 0 0 1px #d9d9d9',
			lineHeight: '1.6em',
			borderRadius: '0.2rem'
		}}
	>
		{formatValue({ nodeValue: data, unit, language: 'fr' })}
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
	const termDefinition = contains('mecanism', classes) && name

	return (
		<div
			className={classNames(classes, 'node', { inline })}
			style={termDefinition ? { borderColor: mecanismColors(name) } : {}}
		>
			{name && !inline && (
				<div className="nodeHead">
					<a
						className="name"
						style={termDefinition ? { background: mecanismColors(name) } : {}}
						data-term-definition={termDefinition}
					>
						<Trans>{name}</Trans>
					</a>
				</div>
			)}
			{children}{' '}
			{name ? (
				!isNil(value) && (
					<div className="mecanism-result">
						= <NodeValuePointer data={value} unit={unit} />
					</div>
				)
			) : (
				<span>
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
			<a
				className="name"
				data-term-definition={name}
				style={{ background: mecanismColors(name) }}
			>
				<Trans>{name}</Trans>
			</a>
		</span>
	)
}

type LeafProps = {
	className: string
	rule: ParsedRule
	nodeValue: NodeValuePointerProps['data']
	filter: string
	unit: NodeValuePointerProps['unit']
}

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export function Leaf({ className, rule, nodeValue, filter, unit }: LeafProps) {
	const title = rule.title || capitalise0(rule.name)
	return (
		<span className={classNames(className, 'leaf')}>
			<span className="nodeHead">
				<RuleLinkWithContext dottedName={rule.dottedName}>
					<span className="name">
						{rule.acronyme ? <abbr title={title}>{rule.acronyme}</abbr> : title}{' '}
						{filter}
					</span>
				</RuleLinkWithContext>
				{!isNil(nodeValue) && <NodeValuePointer data={nodeValue} unit={unit} />}
			</span>
		</span>
	)
}
