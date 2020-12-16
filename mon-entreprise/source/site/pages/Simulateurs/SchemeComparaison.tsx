import SchemeComparaison from 'Components/SchemeComparaison'
import { Trans, useTranslation } from 'react-i18next'

export default function SchemeComparaisonPage() {
	const { t } = useTranslation()
	return (
		<>
			<p>
				<Trans i18nKey="comparaisonRégimes.description">
					Lorsque vous créez votre société, le choix du statut juridique va
					déterminer à quel régime social le dirigeant est affilié. Il en existe
					trois différents, avec chacun ses avantages et inconvénients. Avec ce
					comparatif, trouvez celui qui vous correspond le mieux.
				</Trans>
			</p>
			<br />
			<div className="ui__ full-width">
				<SchemeComparaison />
			</div>
		</>
	)
}
