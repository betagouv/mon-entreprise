import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'

import { H3 } from '@/design-system'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { Références } from '../References/References'
import { useRéférencesÀAfficher } from '../References/useReferencesAAfficher'

type Props = {
	engine: () => Engine<DottedName>
	dottedName: DottedName
}

export const RéférencesDeRègle = ({ engine, dottedName }: Props) => {
	const { t } = useTranslation()
	const { références } = engine().getRule(dottedName).rawNode
	const référencesÀAfficher = useRéférencesÀAfficher(références)

	if (Object.keys(référencesÀAfficher).length === 0) {
		return null
	}

	return (
		<>
			<H3>{t('components.règle.info.références', 'Liens utiles')}</H3>
			<Références références={référencesÀAfficher} />
		</>
	)
}
