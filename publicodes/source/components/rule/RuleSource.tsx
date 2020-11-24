import { mapAccum, scan } from 'ramda'
import React, { useState } from 'react'
import emoji from 'react-easy-emoji'
import yaml, { parse } from 'yaml'
import { reduceAST } from '../../AST'
import { ASTNode } from '../../AST/types'
import Engine, { EvaluatedNode, formatValue } from '../../index'
import PublicodesBlock from '../PublicodesBlock'

type Props = { dottedName: string; engine: Engine }
export default function RuleSource({ engine, dottedName }: Props) {
	const rule = engine.evaluateNode(engine.getParsedRules()[dottedName])
	const dependencies = reduceAST<
		Array<
			ASTNode & {
				nodeKind: 'reference'
			}
		>
	>(
		(acc, node) => {
			if (node.nodeKind === 'reference') {
				return [...acc, node]
			}
			if (node.nodeKind === 'variations' && typeof node.rawNode === 'string') {
				// We don't take replacement into account
				const originNode = node.explanation.slice(-1)[0].consequence
				return originNode.nodeKind === 'reference' ? [...acc, originNode] : acc
			}
		},
		[],
		rule
	)

	// When we import a rule in the Publicode Studio, we need to provide a
	// simplified definition of its dependencies to avoid undefined references.
	const dependenciesValues = Object.fromEntries(
		dependencies.map(reference => [
			reference.dottedName,
			formatValueForStudio(reference as EvaluatedNode)
		])
	)
	const getParents = dottedName => scan(
		(acc, part) => [acc, part].filter(Boolean).join(' . '),
		'', dottedName.split(' . ') as Array<string>).filter(Boolean)

	const values = dependencies.reduce((acc, dep) => {
		getParents(dep.dottedName).forEach(name => {
			acc[name] ??= 'oui'
		})
		return acc
	}, {
		...dependenciesValues,
		[dottedName]: rule.rawNode
	})

	const source = yaml
		.stringify(values)
		// For clarity add a break line before the main rule
		.replace(`${dottedName}:`, `\n${dottedName}:`)

	const baseURL =
		location.hostname === 'localhost' ? '/publicodes' : 'https://publi.codes'
	return (
		<div
			css={`
				text-align: right;
			`}
		>
			<a
				className="ui__ simple small button"
				target="_blank"
				href={`${baseURL}/studio/${encodeRuleName(dottedName)}?code=${encodeURIComponent(source)}`}
			>
				{emoji('✍️')} Voir la règle publicodes
			</a>
		</div>
	)
}
const encodeRuleName = name =>
	name
		?.replace(/\s\.\s/g, '/')
		.replace(/-/g, '\u2011') // replace with a insecable tiret to differenciate from space
		.replace(/\s/g, '-')
// TODO: This formating function should be in the core code. We need to think
// about the different options of the formatting options and our use cases
// (putting a value in the URL #1169, importing a value in the Studio, showing a value
// on screen)
function formatValueForStudio(node: Parameters<typeof formatValue>[0]) {
	const base = formatValue(node)
		.replace(/\s/g, '')
		.replace(',', '.')
	if (base.match(/^[0-9]/) || base === 'Oui' || base === 'Non') {
		return base.toLowerCase()
	} else if (base === '-') {
		return 'non'
	} else {
		return `'${base}'`
	}
}
