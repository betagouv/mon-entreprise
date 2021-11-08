import Emoji from 'Components/utils/Emoji'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { Card } from 'DesignSystem/card'
import { Body } from 'DesignSystem/typography/paragraphs'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Dirigeant } from '../Home'

type RevenuDirigeantCardProps = {
	dirigeant: Dirigeant
}

export function RevenuDirigeantCard({ dirigeant }: RevenuDirigeantCardProps) {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()

	return (
		<Card
			title={t('gérer.choix.revenus.title', 'Revenus en tant que dirigeant')}
			icon={<Emoji emoji="💶" />}
			callToAction={{
				label: t('gérer.choix.revenus.cta', 'Calculer mon revenu net'),
				to: {
					pathname: sitePaths.simulateurs[dirigeant],
					state: {
						fromGérer: true,
					},
				},
			}}
		>
			<Body>
				<Trans i18nKey="gérer.choix.revenus.body">
					Estimez précisément le montant de vos cotisations grâce au simulateur{' '}
					{{ régime: dirigeant }} de l'Urssaf
				</Trans>
			</Body>
		</Card>
	)
}
