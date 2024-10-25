import { Trans } from 'react-i18next'

export default function WarningSalaireTrans() {
	return (
		<Trans i18nKey="pages.simulateurs.réduction-générale.warnings.salaire">
			La RGCP concerne uniquement les salaires inférieurs à 1,6 SMIC.
			C'est-à-dire, pour 2024, une rémunération totale qui ne dépasse pas{' '}
			<strong>2 827,07 €</strong> bruts par mois.
		</Trans>
	)
}
