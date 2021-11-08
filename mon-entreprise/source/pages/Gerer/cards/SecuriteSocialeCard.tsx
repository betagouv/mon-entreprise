import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H5 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export function SecuriteSocialeCard() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Link
			className="ui__ interactive card box lighter-bg"
			to={sitePaths.gérer.sécuritéSociale}
		>
			<Trans i18nKey="gérer.ressources.sécuritéSociale">
				<H5 as="h3">Comprendre la sécurité sociale </H5>
				<p className="ui__ notice">
					A quoi servent les cotisations sociales ? Le point sur le système de
					protection sociale dont bénéficient tous les travailleurs en France
				</p>
			</Trans>
		</Link>
	)
}
