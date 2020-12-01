import React, { useContext, useState } from 'react'
import { Trans } from 'react-i18next'
import styled, { StyledConfig } from 'styled-components'
import mecanismsDoc from '../../../docs/mecanisms.yaml'
import { makeJsx } from '../../evaluation'
import { formatValue } from '../../format'
import { simplifyNodeUnit } from '../../nodeUnits'
import {
	ASTNode,
	ConstantNode,
	Evaluation,
	EvaluatedNode,
	Types,
	Unit,
} from '../../AST/types'
import { capitalise0 } from '../../utils'
import Overlay from '../Overlay'
import { RuleLinkWithContext } from '../RuleLink'
import mecanismColors from './colors'
import MecanismExplanation from './Explanation'
import { ReferenceNode } from '../../reference'
import { RuleNode } from '../../rule'
import { EngineContext } from '../contexts'
import { InternalError } from '../../error'
type NodeValuePointerProps = {
	data: Evaluation<Types>
	unit: Unit | undefined
}

export const NodeValuePointer = ({ data, unit }: NodeValuePointerProps) => (
	<small
		className="nodeValue"
		style={{
			background: 'white',
			borderBottom: '0 !important',
			margin: '0 0.2rem',
			padding: '0 0.2rem',
			textDecoration: 'none !important',
			boxShadow: '0px 1px 2px 1px #d9d9d9, 0 0 0 1px #d9d9d9',
			lineHeight: '1.6em',
			borderRadius: '0.2rem',
		}}
	>
		{formatValue(simplifyNodeUnit({ nodeValue: data, unit }), {
			language: 'fr',
		})}
	</small>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
type NodeProps = {
	name: string
	value: Evaluation<Types>
	unit?: Unit
	children: React.ReactNode
	displayName?: boolean
}

export function Operation({ value, children, unit }: Omit<NodeProps, 'name'>) {
	return (
		<StyledOperation className="operation">
			{children}
			{value != null && (
				<span className="result">
					<small> =&nbsp;</small>
					<NodeValuePointer data={value} unit={unit} />
				</span>
			)}
		</StyledOperation>
	)
}

export function Mecanism({
	name,
	value,
	children,
	unit,
	displayName = true,
}: NodeProps) {
	return (
		<StyledMecanism name={name}>
			{displayName && (
				<MecanismName name={name}>
					<Trans>{name}</Trans>
				</MecanismName>
			)}
			<>
				{children}

				{value != null && (
					<div
						style={{
							textAlign: 'right',
							marginTop: '0.4rem',
							fontWeight: 'bold',
						}}
					>
						<small> =&nbsp;</small>
						<NodeValuePointer data={value} unit={unit} />
					</div>
				)}
			</>
		</StyledMecanism>
	)
}

export const InfixMecanism = ({
	value,
	prefixed,
	children,
	dimValue,
}: {
	value: EvaluatedNode
	children: React.ReactNode
	prefixed?: boolean
	dimValue?: boolean
}) => {
	return (
		<div
			className="infix-mecanism"
			css={`
				.value > .infix-mecanism {
					border: none;
					padding: 0;
				}
				.value > :not(.infix-mecanism) {
					margin-bottom: 1rem;
				}
			`}
		>
			{prefixed && children}
			<div className="value" css={dimValue ? 'opacity: 0.5' : ''}>
				{makeJsx(value)}
			</div>
			{!prefixed && children}
		</div>
	)
}
export const InlineMecanismName = ({ name }: { name: string }) => {
	return (
		<MecanismName inline name={name}>
			<Trans>{name}</Trans>
		</MecanismName>
	)
}

const MecanismName = ({
	name,
	inline = false,
	children,
}: {
	name: string
	inline?: boolean
	children: React.ReactNode
}) => {
	const [showExplanation, setShowExplanation] = useState(false)

	return (
		<>
			<StyledMecanismName
				name={name}
				inline={inline}
				onClick={() => setShowExplanation(true)}
			>
				{children}
			</StyledMecanismName>
			{showExplanation && (
				<Overlay onClose={() => setShowExplanation(false)}>
					<MecanismExplanation name={name} {...mecanismsDoc[name]} />
				</Overlay>
			)}
		</>
	)
}

const StyledOperation = styled.span`
	::before {
		content: '(';
	}
	> .operation ::before,
	> .operation ::after {
		content: '';
	}
	::after {
		content: ')';
	}
	.result {
		margin-left: 0.2rem;
	}
	.operation .result {
		display: none;
	}
`

const StyledMecanism = styled.div<{ name: string }>`
	border: 1px solid;
	max-width: 100%;
	border-radius: 3px;
	padding: 1rem;
	position: relative;
	flex: 1;
	border-color: ${({ name }) => mecanismColors(name)};

	.key {
		font-weight: bold;
	}
`

const StyledMecanismName = styled.button<{ name: string; inline?: boolean }>`
	background-color: ${({ name }) => mecanismColors(name)};
	font-size: inherit;
	font-weight: inherit;
	font-family: inherit;
	padding: 0.4rem 0.6rem;
	color: white;
	transition: hover 0.2s;
	${(props) =>
		props.inline
			? `
		display: inline-block;
		border-radius: 0.3rem;
		`
			: `
		margin-bottom: 0.8rem;
		display: block;

		margin-top: -1rem;
		margin-left: -1rem;
		border-bottom-right-radius: 0.3rem;
		::first-letter {
			text-transform: capitalize;
		}
	`}
	:hover {
		opacity: 0.8;
	}
`

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
export function Leaf(
	node: ReferenceNode & {
		dottedName: string
	} & EvaluatedNode
) {
	const engine = useContext(EngineContext)
	const { dottedName, nodeValue, unit } = node
	const rule = engine?.getParsedRules()[node.dottedName]
	if (!rule) {
		throw new InternalError(node)
	}
	const inlineRule =
		node.dottedName === node.contextDottedName + ' . ' + node.name &&
		!node.name.includes(' . ') &&
		rule.virtualRule
	if (inlineRule) {
		return makeJsx(rule)
	}
	return (
		<span className="variable filtered leaf">
			<span className="nodeHead">
				<RuleLinkWithContext dottedName={dottedName}>
					<span className="name">
						{rule.rawNode.acronyme ? (
							<abbr title={rule.title}>{rule.rawNode.acronyme}</abbr>
						) : (
							rule.title
						)}
					</span>
				</RuleLinkWithContext>

				{nodeValue != null && unit && (
					<NodeValuePointer data={nodeValue} unit={unit} />
				)}
			</span>
		</span>
	)
}
