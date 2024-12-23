import { Trans } from 'react-i18next'

import { useEngine } from '@/components/utils/EngineContext'

export default function WarningSalaireTrans() {
	const engine = useEngine()
	const currentBarème = engine.evaluate(
		'salarié . cotisations . exonérations . lodeom . zone un . barèmes'
	).nodeValue

	return (
		currentBarème && (
			<>
				{currentBarème === 'barème compétitivité' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-compétitivité">
						Le barème de compétitivité concerne uniquement les salaires
						inférieurs à 2,2 SMIC. C'est-à-dire, pour 2024, une rémunération
						totale qui ne dépasse pas <strong>3&nbsp;964&nbsp;€</strong> bruts
						par mois.
					</Trans>
				)}
				{currentBarème === 'barème compétitivité renforcée' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-compétitivité-renforcée">
						Le barème de compétitivité renforcée concerne uniquement les
						salaires inférieurs à 2,7 SMIC. C'est-à-dire, pour 2024, une
						rémunération totale qui ne dépasse pas{' '}
						<strong>4&nbsp;864,86&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
				{currentBarème === 'barème innovation et croissance' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-innovation-croissance">
						Le barème d'innovation et croissance concerne uniquement les
						salaires inférieurs à 3,5 SMIC. C'est-à-dire, pour 2024, une
						rémunération totale qui ne dépasse pas{' '}
						<strong>6&nbsp;306,30&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
			</>
		)
	)
}
