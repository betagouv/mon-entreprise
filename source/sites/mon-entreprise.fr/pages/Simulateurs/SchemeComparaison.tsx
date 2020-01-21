import SchemeComparaison from 'Components/SchemeComparaison'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Trans, useTranslation } from 'react-i18next'

export default function SchemeComparaisonPage() {
	const { t } = useTranslation()
	return (
		<>
			<Helmet>
				<title>
					{t(
						'comparaisonRégimes.page.titre',
						'Indépendant, assimilé salarié ou auto-entrepreneur : découvrez le régime qui vous correspond le mieux'
					)}
				</title>
				<meta
					name="description"
					content={t(
						'comparaisonRégimes.page.description',
						'Quel est le meilleur régime pour votre situation ? Découvrez leur différences et simulez vos revenus et votre retraite en une minute pour chacune des possibilités.'
					)}
				/>
			</Helmet>
			<h1>
				<Trans i18nKey="comparaisonRégimes.titre">
					Indépendant, assimilé salarié ou{' '}
					<span style={{ whiteSpace: 'nowrap' }}>auto-entrepreneur</span> : quel
					régime choisir ?
				</Trans>
			</h1>
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
