import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Message, SmallBody, Strong } from '@/design-system'
import { useCurrentSimulatorMetadata } from '@/hooks/useCurrentSimulatorMetadata'
import { companySituationSelector } from '@/store/selectors/company/companySituation.selector'

export default function WrongSimulateurWarning() {
	const company = useSelector(companySituationSelector)
	const simulatorData = useCurrentSimulatorMetadata().currentSimulatorMetadata

	if (!company['entreprise . catégorie juridique']) {
		return null
	}

	const codesCatégorieJuridique = simulatorData?.codesCatégorieJuridique as
		| readonly string[]
		| undefined

	const isWrongSimulateur =
		simulatorData &&
		codesCatégorieJuridique?.length &&
		codesCatégorieJuridique.indexOf(
			company['entreprise . code catégorie juridique'] as string
		) < 0

	if (!isWrongSimulateur) {
		return null
	}

	return (
		<Message type="error">
			<SmallBody>
				<Trans i18nKey="simulationPréremplieBanner.warning.1">
					Votre catégorie juridique est
				</Trans>{' '}
				<Strong>{company['entreprise . catégorie juridique'] as string}</Strong>{' '}
				<Trans i18nKey="simulationPréremplieBanner.warning.2">
					mais vous êtes sur le simulateur pour{' '}
				</Trans>
				<Strong>{simulatorData.shortName}</Strong>.
			</SmallBody>
		</Message>
	)
}
