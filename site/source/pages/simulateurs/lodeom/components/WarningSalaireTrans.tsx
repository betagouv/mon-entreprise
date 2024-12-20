import { Trans } from 'react-i18next'

export default function WarningSalaireTrans() {
	return (
		<Trans i18nKey="pages.simulateurs.lodeom.warnings.salaire.zone-un.barème-compétitivité">
			Le barème de compétitivité concerne uniquement les salaires inférieurs à
			2,2 SMIC. C'est-à-dire, pour 2024, une rémunération totale qui ne dépasse
			pas <strong>3&nbsp;964&nbsp;€</strong> bruts par mois.
		</Trans>
	)
}
