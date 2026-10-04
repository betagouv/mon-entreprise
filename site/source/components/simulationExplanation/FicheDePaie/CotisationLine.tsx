import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { formatValue } from 'publicodes'
import { useTranslation } from 'react-i18next'

import RuleLink from '@/components/RuleLink'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { Namespace, partPatronale, partSalariale } from './utils'

type Props = {
	namespace: Namespace
	dottedName: RègleModèleSocial | RègleModèleAssimiléSalarié
}

export const CotisationLine = ({ namespace, dottedName }: Props) => {
	const language = useTranslation().i18n.language
	const engine = useEngine()

	const employeur = partPatronale(engine, namespace, dottedName)
	const salarié = partSalariale(engine, namespace, dottedName)

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
				{employeur?.nodeValue
					? signePlusOuMoins +
						formatValue(employeur, { displayedUnit: '€', language })
					: '–'}
			</td>
			<td>
				{salarié?.nodeValue
					? signePlusOuMoins +
						formatValue(salarié, { displayedUnit: '€', language })
					: '–'}
			</td>
		</tr>
	)
}
