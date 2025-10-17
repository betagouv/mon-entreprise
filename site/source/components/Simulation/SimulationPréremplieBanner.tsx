import { difference } from 'effect/Array'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import SimulationBanner from '@/components/Simulation/Banner'
import { Link, PopoverWithTrigger } from '@/design-system'
import { companySituationSelector } from '@/store/selectors/companySituation.selector'
import { situationSelector } from '@/store/selectors/simulationSelectors'

import { AnswersList } from '../conversation/AnswersList'
import WrongSimulateurWarning from '../WrongSimulateurWarning'

export default function SimulationPréremplieBanner() {
	const companySituation = useSelector(companySituationSelector)
	const simulationSituation = useSelector(situationSelector)
	const preexistingCompanySituation =
		difference(Object.keys(companySituation), Object.keys(simulationSituation))
			.length > 0

	const { t } = useTranslation()

	if (!preexistingCompanySituation) {
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
				{(close) => <AnswersList onClose={close} />}
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
