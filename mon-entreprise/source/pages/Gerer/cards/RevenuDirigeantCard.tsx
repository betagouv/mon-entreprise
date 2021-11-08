import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H3 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dirigeant } from '../Home'

type RevenuDirigeantCardProps = {
	dirigeant: Dirigeant
}

export function RevenuDirigeantCard({ dirigeant }: RevenuDirigeantCardProps) {
	const sitePaths = useContext(SitePathsContext)

	if (dirigeant === null) return null

	return (
		<Link
			className="ui__ interactive card box light-border"
			to={{
				pathname: sitePaths.simulateurs[dirigeant],
				state: {
					fromGérer: true,
				},
			}}
		>
			<div className="ui__ big box-icon">
				<Emoji emoji="💶" />
			</div>
			<Trans i18nKey="gérer.choix.revenus">
				<H3>Calculer mon revenu net de cotisations</H3>
				<p className="ui__ notice">
					Estimez précisément le montant de vos cotisations grâce au simulateur{' '}
					{{ régime: dirigeant }} de l'Urssaf
				</p>
			</Trans>
			<div className="ui__ small simple button hide-mobile">
				<Trans>Commencer</Trans>
			</div>
		</Link>
	)
}
