import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Engine from '..'
import { encodeRuleName, nameLeaf } from '../ruleUtils'
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

	// There is a problem with this line of code : we loose the information
	// about the applicability of the formula. Besides, when we are not in the context of the
	// rules which defines the reference, we want to print a link to the parent rule and not
	// the value directly.

	// Besides, sometimes nodes don't have formula (which makes the doc page crash)

	// Furthermore, nothing prevent from using a type notification as a reference

	// For all these reason, I'm advocating for a change of perspective inside this notion of ruleWithDedicatedDocumentationPage

	// if (!ruleWithDedicatedDocumentationPage(rule)) {
	// 	return <Explanation node={engine.evaluate(rule.dottedName).formule} />
	// }
	if (rule) {
		return (
			<Link to={newPath} {...props}>
				{children || rule.title}{' '}
				{displayIcon && rule.rawNode.icônes && (
					<span>{emoji(rule.rawNode.icônes)} </span>
				)}
			</Link>
		)
	} else {
		return <>{nameLeaf(dottedName)}</>
	}
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
