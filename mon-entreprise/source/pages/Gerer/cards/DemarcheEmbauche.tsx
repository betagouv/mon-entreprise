import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H5 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export function DemarcheEmbaucheCard() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<Link
			className="ui__ interactive card box lighter-bg"
			to={sitePaths.gérer.embaucher}
		>
			<Trans i18nKey="gérer.ressources.embaucher">
				<H5 as="h3">Découvrir les démarches d’embauche </H5>
				<p className="ui__ notice">
					La liste des choses à faire pour être sûr de ne rien oublier lors de
					l’embauche d’un nouveau salarié
				</p>
			</Trans>
		</Link>
	)
}
