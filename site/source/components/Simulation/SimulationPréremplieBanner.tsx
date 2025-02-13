import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import SimulationBanner from '@/components/Simulation/Banner'
import { PopoverWithTrigger } from '@/design-system'
import { Link } from '@/design-system/typography/link'
import { companySituationSelector } from '@/store/selectors/simulationSelectors'

import AnswerList from '../conversation/AnswerList'
import WrongSimulateurWarning from '../WrongSimulateurWarning'

export default function SimulationPréremplieBanner() {
	const existingCompany = !!useSelector(companySituationSelector)[
		'entreprise . SIREN'
	]

	const { t } = useTranslation()

	if (!existingCompany) {
		return null
	}

	return (
		<SimulationBanner icon="✏">
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
						<Trans i18nKey="simulationPréremplieBanner.button">
							Voir ma situation
						</Trans>
					</Link>
				)}
			>
				{(close) => <AnswerList onClose={close} />}
			</PopoverWithTrigger>
			<WrongSimulateurWarningContainer>
				<WrongSimulateurWarning />
			</WrongSimulateurWarningContainer>
		</SimulationBanner>
	)
}

const WrongSimulateurWarningContainer = styled.div`
	margin-top: ${({ theme }) => theme.spacings.xs};
`
