import { DottedName } from 'modele-social'
import { formatValue } from 'publicodes'
import { Trans } from 'react-i18next'

import { useEngine } from '@/components/utils/EngineContext'
import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'
import useYear from '@/hooks/useYear'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { round } from '@/utils/number'

export default function WarningSalaireTrans() {
	const zone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()

	const engine = useEngine()

	const barèmeRule = engine.getRule(
		`salarié . cotisations . exonérations . lodeom . ${zone} . barèmes . ${currentBarème}` as DottedName
	)
	const barème = barèmeRule.title.toLocaleLowerCase()

	const seuilDeSortie = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil sortie'
	).nodeValue as number
	const seuil = formatValue(seuilDeSortie) as string

	const year = useYear()

	const smic = engine.evaluate({
		valeur: 'SMIC',
		unité: '€/an',
	}).nodeValue as number
	const plafond = formatValue(round(seuilDeSortie * smic, 2), {
		displayedUnit: '€',
	}) as string

	return (
		barème &&
		seuil &&
		year &&
		plafond && (
			<Trans i18nKey={'pages.simulateurs.lodeom.warnings.salaire'}>
				Le {{ barème }} concerne uniquement les salaires inférieurs à{' '}
				{{ seuil }} Smic. C'est-à-dire, pour {{ year }}, une rémunération totale
				qui ne dépasse pas <strong>{{ plafond }}</strong> bruts par an.
			</Trans>
		)
	)
}
