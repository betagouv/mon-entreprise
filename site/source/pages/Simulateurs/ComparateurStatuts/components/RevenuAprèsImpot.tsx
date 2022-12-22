import Engine from 'publicodes'
import { Trans } from 'react-i18next'

import { DottedName } from '@/../../modele-social'
import Value from '@/components/EngineValue'
import { Grid } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'

import StatusCard from './StatusCard'

const RevenuAprèsImpot = ({
	engines: [assimiléEngine, autoEntrepreneurEngine, indépendantEngine],
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}) => {
	return (
		<>
			<H2>
				<Trans>Revenu après impôt</Trans>
			</H2>

			<Grid container>
				<Grid item xs={12} lg={4}>
					<StatusCard status={['sasu']}>
						<Value
							linkToRule={false}
							expression="dirigeant . rémunération . net . après impôt"
							engine={assimiléEngine}
							precision={0}
							unit="€/mois"
						/>{' '}
						la première année
					</StatusCard>
				</Grid>

				<Grid item xs={12} lg={4}>
					<StatusCard status={['ei']}>
						<Value
							linkToRule={false}
							expression="dirigeant . rémunération . net . après impôt"
							engine={indépendantEngine}
							precision={0}
							unit="€/mois"
						/>{' '}
						la première année
					</StatusCard>{' '}
				</Grid>

				<Grid item xs={12} lg={4}>
					<StatusCard status={['ae']} isBestOption>
						<Value
							linkToRule={false}
							expression="dirigeant . rémunération . net . après impôt"
							engine={autoEntrepreneurEngine}
							precision={0}
							unit="€/mois"
						/>
					</StatusCard>
				</Grid>
			</Grid>
		</>
	)
}

export default RevenuAprèsImpot
