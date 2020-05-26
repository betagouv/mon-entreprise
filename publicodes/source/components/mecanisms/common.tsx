import classnames from 'classnames'
import React, { useState, useEffect } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import { formatValue } from '../../format'
import { Evaluation, ParsedRule, Types, Unit, EvaluatedNode } from '../../types'
import { capitalise0 } from '../../utils'
import { RuleLinkWithContext } from '../RuleLink'
import mecanismColors from './colors'
import Modal from '../Modal'
import { makeJsx } from '../../evaluation'
import MecanismExplanation from './Explanation'
import mecanismsDoc from '../../../docs/mecanisms.yaml'
import { simplifyNodeUnit } from '../../nodeUnits'
type NodeValuePointerProps = {
	data: Evaluation<Types>
	unit: Unit
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
			borderRadius: '0.2rem'
		}}
	>
		{formatValue(simplifyNodeUnit({ nodeValue: data, unit }), {
			language: 'fr'
		})}
	</small>
)

// Un élément du graphe de calcul qui a une valeur interprétée (à afficher)
type NodeProps = {
	name: string
	value: Evaluation<Types>
	unit: Unit
	children: React.ReactNode
	displayName?: boolean
}

export function Operation({ value, children, unit }: NodeProps) {
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
	displayName = true
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
							fontWeight: 'bold'
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
	children
}: {
	value: EvaluatedNode
	children: React.ReactNode
}) => {
	return (
		<div
			className="infix-mecanism"
			css={`
				line-height: 1.7rem;
				border: 1px solid var(--darkColor);
				padding: 1rem;
				border-radius: 0.3rem;
				.value > .infix-mecanism {
					border: none;
					padding: 0;
				}
				.value > :not(.infix-mecanism) {
					margin-bottom: 1rem;
				}
			`}
		>
			<div className="value">{makeJsx(value)}</div>
			{children}
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
	children
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
				<Modal onClose={() => setShowExplanation(false)}>
					<MecanismExplanation name={name} {...mecanismsDoc[name]} />
				</Modal>
			)}
		</>
	)
}

const StyledOperation = styled.span`
	line-height: 1.7rem;

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
	${props =>
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
		<span className={classnames(className, 'leaf')}>
			<span className="nodeHead">
				<RuleLinkWithContext dottedName={rule.dottedName}>
					<span className="name">
						{rule.acronyme ? <abbr title={title}>{rule.acronyme}</abbr> : title}{' '}
						{filter}
					</span>
				</RuleLinkWithContext>
				{nodeValue != null && <NodeValuePointer data={nodeValue} unit={unit} />}
			</span>
		</span>
	)
}
