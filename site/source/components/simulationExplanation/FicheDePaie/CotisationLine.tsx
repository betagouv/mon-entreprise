import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { useEngine } from '@/utils/publicodes/EngineContext'
import { findReferenceInNode } from '@/utils/publicodes/publicodes'

import { Namespace } from './utils'

type Props = {
	namespace: Namespace
	dottedName: RègleModèleSocial | RègleModèleAssimiléSalarié
}

export const CotisationLine = ({ namespace, dottedName }: Props) => {
	const language = useTranslation().i18n.language
	const engine = useEngine()

	const partSalariale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule(`${namespace} . cotisations . salarié`)
		) ?? '0'
	)
	const partPatronale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule(`${namespace} . cotisations . employeur`)
		) ?? '0'
	)

	const isExoneration = (
		dottedName: RègleModèleSocial | RègleModèleAssimiléSalarié
	): boolean => dottedName === `${namespace} . cotisations . exonérations`
	const signePlusOuMoins = isExoneration(dottedName) ? '-' : ''

	return (
		<tr>
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
