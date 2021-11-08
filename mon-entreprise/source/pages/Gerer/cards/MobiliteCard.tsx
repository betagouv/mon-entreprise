import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H5 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export function MobiliteCard() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Link
			className="ui__ interactive card box lighter-bg"
			to={sitePaths.gérer.formulaireMobilité}
		>
			<Trans i18nKey="gérer.ressources.export">
				<H5 as="h3">Exporter son activité en Europe</H5>
				<p className="ui__ notice">
					Le formulaire pour effectuer une demande de mobilité internationale
					(détachement ou pluriactivité)
				</p>
			</Trans>
		</Link>
	)
}
