import Engine from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { DottedName } from '@/../../modele-social'
import Value from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { CheckList } from '@/design-system'
import { ExternalLinkIcon, HelpIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { H2 } from '@/design-system/typography/heading'
import { StyledLink } from '@/design-system/typography/link'

import AllerPlusLoinRevenus from './AllerPlusLoinRevenus'
import StatusCard from './StatusCard'

const RevenuAprèsImpot = ({
	engines,
}: {
	engines: [Engine<DottedName>, Engine<DottedName>, Engine<DottedName>]
}) => {
	const [assimiléEngine, autoEntrepreneurEngine, indépendantEngine] = engines
	const { t } = useTranslation()

	return (
		<>
			<H2>
				<Trans>Revenu après impôt</Trans>
			</H2>

			<Grid container spacing={4}>
				<Grid item xs={12} lg={4}>
					<StatusCard
						status={['sasu']}
						footerContent={
							<CheckList
								items={[
									{ isChecked: true, label: t("Tient compte de l'ACRE") },
									{
										isChecked: true,
										label: t("Choix d'imposition : impôt sur les sociétés"),
									},
								]}
							/>
						}
					>
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
					<StatusCard
						status={['ei']}
						footerContent={
							<CheckList
								items={[
									{ isChecked: true, label: t("Tient compte de l'ACRE") },
									{
										isChecked: true,
										label: t("Choix d'imposition : impôt sur les sociétés"),
									},
								]}
							/>
						}
					>
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
					<StatusCard
						status={['ae']}
						isBestOption
						footerContent={
							<CheckList
								items={[
									{
										isChecked: false,
										label: (
											<Trans>
												<span>
													ACRE sous{' '}
													<BlackColoredLink href="https://www.urssaf.fr/portail/home/independant/je-beneficie-dexonerations/accre.html">
														certaines conditions
														<StyledExternalLinkIcon />
													</BlackColoredLink>
												</span>
											</Trans>
										),
									},
									{
										isChecked: true,
										label: t("Versement libératoire de l'impôt sur le revenu"),
									},
								]}
							/>
						}
					>
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
			<DivAlignRight>
				<AllerPlusLoinRevenus engines={engines} />
			</DivAlignRight>
		</>
	)
}

export default RevenuAprèsImpot

const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: ${({ theme }) => theme.spacings.xxs};
	&:hover {
		opacity: 0.8;
	}
`

const StyledExternalLinkIcon = styled(ExternalLinkIcon)`
	margin-left: 0.25rem;
`

const BlackColoredLink = styled(StyledLink)`
	color: ${({ theme }) => theme.colors.extended.grey[800]};
`

const DivAlignRight = styled.div`
	margin-top: ${({ theme }) => theme.spacings.lg};
	text-align: right;
`
