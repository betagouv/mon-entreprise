import { Trans } from 'react-i18next'

import { useBarèmeLodeom } from '@/hooks/useBarèmeLodeom'

export default function WarningSalaireTrans() {
	const currentBarème = useBarèmeLodeom()

	return (
		currentBarème && (
			<>
				{currentBarème === 'compétitivité' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-compétitivité">
						Le barème de compétitivité concerne uniquement les salaires
						inférieurs à 2,2 SMIC. C'est-à-dire, pour 2024, une rémunération
						totale qui ne dépasse pas <strong>3&nbsp;964&nbsp;€</strong> bruts
						par mois.
					</Trans>
				)}
				{currentBarème === 'compétitivité renforcée' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-compétitivité-renforcée">
						Le barème de compétitivité renforcée concerne uniquement les
						salaires inférieurs à 2,7 SMIC. C'est-à-dire, pour 2024, une
						rémunération totale qui ne dépasse pas{' '}
						<strong>4&nbsp;864,86&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
				{currentBarème === 'innovation et croissance' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-innovation-croissance">
						Le barème d'innovation et croissance concerne uniquement les
						salaires inférieurs à 3,5 SMIC. C'est-à-dire, pour 2024, une
						rémunération totale qui ne dépasse pas{' '}
						<strong>6&nbsp;306,30&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
				{currentBarème === 'moins de 11 salariés' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-deux.barème-moins-de-11-salariés">
						Le barème pour les employeurs de moins de 11 salariés concerne
						uniquement les salaires inférieurs à 3 SMIC. C'est-à-dire, pour
						2024, une rémunération totale qui ne dépasse pas{' '}
						<strong>5&nbsp;405,40&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
				{currentBarème === 'sectoriel' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-deux.barème-sectoriel">
						Le barème d'exonération sectorielle concerne uniquement les salaires
						inférieurs à 3 SMIC. C'est-à-dire, pour 2024, une rémunération
						totale qui ne dépasse pas <strong>5&nbsp;405,40&nbsp;€</strong>{' '}
						bruts par mois.
					</Trans>
				)}
				{currentBarème === 'renforcé' && (
					<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-deux.barème-renforcé">
						Le barème d'exonération renforcée uniquement les salaires inférieurs
						à 4,5 SMIC. C'est-à-dire, pour 2024, une rémunération totale qui ne
						dépasse pas <strong>8&nbsp;108,10&nbsp;€</strong> bruts par mois.
					</Trans>
				)}
			</>
		)
	)
}
