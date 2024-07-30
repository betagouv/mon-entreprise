import { DottedName } from 'modele-social'
import { ASTNode, formatValue, reduceAST } from 'publicodes'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { EngineContext } from '@/components/utils/EngineContext'

export default function CotisationLine({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const language = useTranslation().i18n.language
	const engine = useContext(EngineContext)
	const partSalariale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule('salarié . cotisations . salarié')
		) ?? '0'
	)
	const partPatronale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule('salarié . cotisations . employeur')
		) ?? '0'
	)
	const signePlusOuMoins = isExoneration(dottedName) ? '-' : ''

	if (!partPatronale.nodeValue && !partSalariale.nodeValue) {
		return null
	}

	return (
		<>
			<RuleLink dottedName={dottedName} />
			<span>
				{partPatronale?.nodeValue
					? signePlusOuMoins +
					  formatValue(partPatronale, { displayedUnit: '€', language })
					: '–'}
			</span>
			<span>
				{partSalariale?.nodeValue
					? signePlusOuMoins +
					  formatValue(partSalariale, { displayedUnit: '€', language })
					: '–'}
			</span>
		</>
	)
}

function isExoneration(dottedName: DottedName): boolean {
	return dottedName === 'salarié . cotisations . exonérations'
}

function findReferenceInNode(
	dottedName: DottedName,
	node: ASTNode
): string | undefined {
	return reduceAST<string | undefined>(
		(acc, node) => {
			if (
				node.nodeKind === 'reference' &&
				node.dottedName?.startsWith(dottedName) &&
				!node.dottedName.endsWith('$SITUATION')
			) {
				return node.dottedName
			} else if (node.nodeKind === 'reference') {
				return acc
			}
		},
		undefined,
		node
	)
}
