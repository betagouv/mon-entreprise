import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Engine from '..'
import { makeJsx } from '../evaluation'
import {
	encodeRuleName,
	ruleWithDedicatedDocumentationPage
} from '../ruleUtils'
import { BasepathContext, EngineContext } from './contexts'

type RuleLinkProps<Name extends string> = Omit<
	React.ComponentProps<Link>,
	'to'
> & {
	dottedName: Name
	engine: Engine<Name>
	documentationPath: string
	displayIcon?: boolean
	children?: React.ReactNode
}

export function RuleLink<Name extends string>({
	dottedName,
	engine,
	documentationPath,
	displayIcon = false,
	children,
	...props
}: RuleLinkProps<Name>) {
	const rule = engine.getParsedRules()[dottedName]
	const newPath = documentationPath + '/' + encodeRuleName(dottedName)

	if (!ruleWithDedicatedDocumentationPage(rule)) {
		// There is a problem with this line of code : we loose the information
		// about the applicability of the formula.
		// Besides, sometimes nodes don't have formula (which makes the doc page crash)
		return makeJsx(engine.evaluate(rule.dottedName).formule)
	}

	return (
		<Link to={newPath} {...props}>
			{children || rule.title}{' '}
			{displayIcon && rule.icons && <span>{emoji(rule.icons)} </span>}
		</Link>
	)
}

export function RuleLinkWithContext(
	props: Omit<RuleLinkProps<string>, 'engine' | 'documentationPath'>
) {
	const engine = useContext(EngineContext)
	if (!engine) {
		throw new Error('an engine should be provided in context')
	}
	const documentationPath = useContext(BasepathContext)

	return (
		<RuleLink
			engine={engine}
			documentationPath={documentationPath}
			{...props}
		/>
	)
}
