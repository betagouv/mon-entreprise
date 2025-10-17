import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/hooks/useEngine'
import { findReferenceInNode } from '@/utils/publicodes/publicodes'

export default function CotisationLine({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const language = useTranslation().i18n.language
	const engine = useEngine()
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

	return (
		<tr className="payslip__cotisationLine">
			<th scope="row">
				<RuleLink dottedName={dottedName} />
			</th>
			<td>
				{partPatronale?.nodeValue
					? signePlusOuMoins +
					  formatValue(partPatronale, { displayedUnit: '€', language })
					: '–'}
			</td>
			<td>
				{partSalariale?.nodeValue
					? signePlusOuMoins +
					  formatValue(partSalariale, { displayedUnit: '€', language })
					: '–'}
			</td>
		</tr>
	)
}

function isExoneration(dottedName: DottedName): boolean {
	return dottedName === 'salarié . cotisations . exonérations'
}
