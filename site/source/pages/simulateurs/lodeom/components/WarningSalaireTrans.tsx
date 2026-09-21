import { formatValue } from 'publicodes'
import { Trans } from 'react-i18next'

import { DottedName } from '@/domaine/publicodes/DottedName'
import {
	barèmeLodeomDottedName,
	useBarèmeLodeom,
} from '@/hooks/useBarèmeLodeom'
import useYear from '@/hooks/useYear'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { round } from '@/utils/number'
import { useEngine } from '@/utils/publicodes/EngineContext'

export default function WarningSalaireTrans() {
	const zone = useZoneLodeom()
	const currentBarème = useBarèmeLodeom()
	const engine = useEngine()
	const year = useYear()

	if (!zone) {
		return null
	}

	const smic1erJanvier = zone !== 'mayotte'
	const barèmeRule = engine.getRule(
		`${barèmeLodeomDottedName(zone)} . ${currentBarème}` as DottedName
	)
	const barème = barèmeRule.title.toLocaleLowerCase()

	const seuilDeSortie = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . montant . seuil sortie'
	).nodeValue as number
	const seuil = formatValue(seuilDeSortie) as string

	const smic = engine.evaluate({
		valeur: 'SMIC',
		unité: '€/an',
		...(smic1erJanvier
			? {
					contexte: {
						date: `01/01/${year}`,
					},
				}
			: {}),
	}).nodeValue as number
	const plafond = formatValue(round(seuilDeSortie * smic, 2), {
		displayedUnit: '€',
	}) as string

	if (!barème || !seuil || !year || !plafond) {
		return null
	}

	return smic1erJanvier ? (
		<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.1er-janvier">
			Le {{ barème }} concerne uniquement les salaires inférieurs à {{ seuil }}{' '}
			Smic (valeur du 1er janvier). C'est-à-dire, pour {{ year }}, une
			rémunération totale qui ne dépasse pas <strong>{{ plafond }}</strong>{' '}
			bruts par an pour un temps plein sans heures supplémentaires.
		</Trans>
	) : (
		<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.courant">
			Le {{ barème }} concerne uniquement les salaires inférieurs à {{ seuil }}{' '}
			Smic. C'est-à-dire, pour {{ year }}, une rémunération totale qui ne
			dépasse pas <strong>{{ plafond }}</strong> bruts par an pour un temps
			plein sans heures supplémentaires.
		</Trans>
	)
}
