import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H3 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export function MontantEmbaucheCard() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Link
			className="ui__ interactive card box light-border"
			to={{
				pathname: sitePaths.simulateurs.salarié,
				search: '?view=employeur',
				state: {
					fromGérer: true,
				},
			}}
		>
			<div className="ui__ big box-icon">
				<Emoji emoji="🤝" />
			</div>
			<Trans i18nKey="gérer.choix.embauche">
				<H3>Estimer le montant d’une embauche</H3>
				<p className="ui__ notice">
					Calculez le montant total que votre entreprise devra dépenser pour
					rémunérer votre prochain employé
				</p>
			</Trans>
			<div className="ui__ small simple button hide-mobile">
				<Trans>Commencer</Trans>
			</div>
		</Link>
	)
}
