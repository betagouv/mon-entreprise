import Emoji from 'Components/utils/Emoji'
import { H3 } from 'DesignSystem/typography/heading'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { useContext } from 'react'

export function DeclarationIndedependantsCard() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Link
			className="ui__ interactive card box light-border"
			to={{
				pathname: sitePaths.gérer.déclarationIndépendant,
			}}
		>
			<div className="ui__ big box-icon">
				<Emoji emoji="✍" />
			</div>
			<Trans i18nKey="gérer.choix.déclaration">
				<H3>Remplir ma déclaration de revenus</H3>
				<p className="ui__ notice">
					Calculez facilement les montants des charges sociales à reporter dans
					votre déclaration de revenu au titre de 2020
				</p>
			</Trans>
			<div className="ui__ small simple button hide-mobile">
				<Trans>Commencer</Trans>
			</div>
		</Link>
	)
}
