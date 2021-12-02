import SchemeComparaison from 'Components/SchemeComparaison'
import { Intro } from 'DesignSystem/typography/paragraphs'
import { Trans } from 'react-i18next'

export default function SchemeComparaisonPage() {
	return (
		<>
			<Intro>
				<Trans i18nKey="comparaisonRégimes.description">
					Lorsque vous créez votre société, le choix du statut juridique va
					déterminer à quel régime social le dirigeant est affilié. Il en existe
					trois différents, avec chacun ses avantages et inconvénients. Avec ce
					comparatif, trouvez celui qui vous correspond le mieux.
				</Trans>
			</Intro>
			<SchemeComparaison />
		</>
	)
}
