import React, { useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import Engine from '..'
import { encodeRuleName } from '../ruleUtils'
import {
	BasepathContext,
	EngineContext,
	UseDefaultValuesContext
} from './contexts'

type RuleLinkProps<Name extends string> = Omit<
	React.ComponentProps<Link>,
	'to'
> & {
	dottedName: Name
	engine: Engine<Name>
	documentationPath: string
	displayIcon?: boolean
	useDefaultValues?: boolean
	children?: React.ReactNode
}

export function RuleLink<Name extends string>({
	dottedName,
	engine,
	documentationPath,
	displayIcon = false,
	useDefaultValues = false,
	children,
	...props
}: RuleLinkProps<Name>) {
	const rule = engine.getParsedRules()[dottedName]
	const newPath = documentationPath + '/' + encodeRuleName(dottedName)

	return (
		<Link to={{ pathname: newPath, state: { useDefaultValues } }} {...props}>
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
	const useDefaultValues = useContext(UseDefaultValuesContext)

	return (
		<RuleLink
			engine={engine}
			documentationPath={documentationPath}
			useDefaultValues={useDefaultValues}
			{...props}
		/>
	)
}
