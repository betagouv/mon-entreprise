import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Message, PopoverWithTrigger } from '@/design-system'
import { Spacing } from '@/design-system/layout'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { useCurrentSimulatorData } from '@/hooks/useCurrentSimulatorData'
import { PageConfig } from '@/pages/simulateurs/_configs/types'
import { companySituationSelector } from '@/store/selectors/simulationSelectors'

import Banner from './Banner'
import AnswerList from './conversation/AnswerList'

export default function SimulationPréremplieBanner() {
	const company = useSelector(companySituationSelector)
	const existingCompany = !!company['entreprise . SIREN']

	const simulatorData = useCurrentSimulatorData().currentSimulatorData as
		| PageConfig
		| undefined
	const isWrongSimulateur =
		simulatorData &&
		simulatorData.codesCatégorieJuridique?.length &&
		simulatorData.codesCatégorieJuridique.indexOf(
			company['entreprise . code catégorie juridique'] as string
		) < 0

	const { t } = useTranslation()

	if (!existingCompany) {
		return null
	}

	return (
		<Banner icon="✏">
			<Trans i18nKey="simulationPréremplieBanner.info">
				Ce simulateur a été prérempli avec la situation de votre entreprise.
			</Trans>{' '}
			<PopoverWithTrigger
				trigger={(buttonProps) => (
					<Link
						{...buttonProps}
						aria-haspopup="dialog"
						aria-label={t(
							'simulationPréremplieBanner.aria-label',
							'Voir ma situation, accéder à la page de gestion de mon entreprise'
						)}
					>
						<Trans i18nKey="simulationPréremplieBanner.button">Voir ma situation</Trans>
					</Link>
				)}
			>
				{(close) => <AnswerList onClose={close} />}
			</PopoverWithTrigger>
			{isWrongSimulateur && (
				<>
					<Spacing xxs />
					<Message type="error">
						<SmallBody>
							<Trans i18nKey="simulationPréremplieBanner.warning.1">
								Votre catégorie juridique est
							</Trans>{' '}
							<Strong>
								{company['entreprise . catégorie juridique'] as string}
							</Strong>{' '}
							<Trans i18nKey="simulationPréremplieBanner.warning.2">
								mais vous êtes sur le simulateur pour{' '}
							</Trans>
								<Strong>{simulatorData.shortName}</Strong>.
						</SmallBody>
					</Message>
				</>
			)}
		</Banner>
	)
}
