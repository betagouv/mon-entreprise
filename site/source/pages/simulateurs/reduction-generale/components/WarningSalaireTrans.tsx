import { formatValue } from 'publicodes'
import { Trans } from 'react-i18next'

import { useEngine } from '@/components/utils/EngineContext'
import useYear from '@/hooks/useYear'
import { round } from '@/utils/number'

export default function WarningSalaireTrans() {
	const year = useYear()
	const engine = useEngine()
	const smic = engine.evaluate('SMIC').nodeValue as number
	const plafond = formatValue(round(1.6 * smic), {
		displayedUnit: '€',
	}) as string

	return (
		<Trans i18nKey={'pages.simulateurs.réduction-générale.warnings.salaire'}>
			La RGCP concerne uniquement les salaires inférieurs à 1,6 Smic.
			C'est-à-dire, pour {{ year }}, une rémunération totale qui ne dépasse pas{' '}
			<strong>{{ plafond }}</strong> bruts par mois.
		</Trans>
	)
}
