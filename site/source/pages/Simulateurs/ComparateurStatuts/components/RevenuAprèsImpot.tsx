import Engine from 'publicodes'
import { Trans } from 'react-i18next'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import Value from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { ExplicableRule } from '@/components/conversation/Explicable'
import { HelpIcon } from '@/design-system/icons'
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
						<span>
							<Value
								linkToRule={false}
								expression="dirigeant . rémunération . net . après impôt"
								engine={assimiléEngine}
								precision={0}
								unit="€/mois"
							/>{' '}
							la première année
						</span>
						<StyledRuleLink
							dottedName="dirigeant . rémunération . net . après impôt"
							engine={assimiléEngine}
						>
							<HelpIcon />
						</StyledRuleLink>
					</StatusCard>
				</Grid>

				<Grid item xs={12} lg={4}>
					<StatusCard status={['ei']}>
						<span>
							<Value
								linkToRule={false}
								expression="dirigeant . rémunération . net . après impôt"
								engine={indépendantEngine}
								precision={0}
								unit="€/mois"
							/>{' '}
							la première année
						</span>
						<StyledRuleLink
							dottedName="dirigeant . rémunération . net . après impôt"
							engine={indépendantEngine}
						>
							<HelpIcon />
						</StyledRuleLink>
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
						<StyledRuleLink
							dottedName="dirigeant . rémunération . net . après impôt"
							engine={autoEntrepreneurEngine}
						>
							<HelpIcon />
						</StyledRuleLink>
					</StatusCard>
				</Grid>
			</Grid>
		</>
	)
}

export default RevenuAprèsImpot

const StyledRuleLink = styled(RuleLink)`
	display: inline-block;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`
