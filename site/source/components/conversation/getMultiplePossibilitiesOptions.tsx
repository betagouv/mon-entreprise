import Engine, { RuleNode } from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

type RuleWithMultiplePossibilities = RuleNode & {
	rawNode: RuleNode['rawNode'] & {
		'plusieurs possibilités'?: Array<string>
	}
}

export function isMultiplePossibilities(
	engine: Engine<DottedName>,
	dottedName: DottedName
): boolean {
	return !!(engine.getRule(dottedName) as RuleWithMultiplePossibilities)
		.rawNode['plusieurs possibilités']
}

export function getMultiplePossibilitiesOptions(
	engine: Engine<DottedName>,
	dottedName: DottedName
): RuleNode<DottedName>[] {
	return (
		(engine.getRule(dottedName) as RuleWithMultiplePossibilities).rawNode[
			'plusieurs possibilités'
		] ?? []
	).map((name) => engine.getRule(`${dottedName} . ${name}` as DottedName))
}
