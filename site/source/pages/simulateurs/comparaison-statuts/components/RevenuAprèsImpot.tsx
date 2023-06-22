import Engine from 'publicodes'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import Value, { Condition, WhenAlreadyDefined } from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { StatutType } from '@/components/StatutTag'
import { CheckList } from '@/design-system'
import { ExternalLinkIcon, HelpIcon } from '@/design-system/icons'
import { Grid } from '@/design-system/layout'
import { StyledLink } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

import AllerPlusLoinRevenus from './AllerPlusLoinRevenus'
import { EngineComparison } from './Comparateur'
import { getGridSizes } from './DetailsRowCards'
import StatusCard from './StatusCard'

const RevenuAprèsImpot = ({
	namedEngines,
}: {
	namedEngines: EngineComparison
}) => {
	const gridSizes = getGridSizes(1, namedEngines.length)

	return (
		<>
			<Grid container spacing={4}>
				<Grid item {...gridSizes}>
					<RevenuBloc {...namedEngines[0]} />
				</Grid>
				<Grid item {...gridSizes}>
					<RevenuBloc {...namedEngines[1]} />
				</Grid>
				<Grid item {...gridSizes}>
					{namedEngines[2] && <RevenuBloc {...namedEngines[2]} />}
				</Grid>
			</Grid>
			<AllerPlusLoinRevenus namedEngines={namedEngines} />
		</>
	)
}

function RevenuBloc({
	engine,
	name,
}: {
	engine: Engine<DottedName>
	name: StatutType
}) {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<StatusCard
			statut={[name]}
			footerContent={
				<CheckList
					items={[
						{
							isChecked: engine.evaluate({
								valeur: 'dirigeant . exonérations . ACRE',
							}).nodeValue as boolean,
							label: engine.evaluate({
								valeur: 'dirigeant . exonérations . ACRE',
							}).nodeValue
								? t("Tient compte de l'ACRE")
								: t("Ne prend pas l'ACRE en compte"),
						},
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
					engine={engine}
					precision={0}
					unit="€/mois"
				/>{' '}
				<Condition engine={engine} expression="dirigeant . exonérations . ACRE">
					<WhenAlreadyDefined
						dottedName="dirigeant . rémunération . net . après impôt"
						engine={engine}
					>
						<Trans>la première année</Trans>
					</WhenAlreadyDefined>
				</Condition>
			</span>
			<StyledRuleLink
				dottedName="dirigeant . rémunération . net . après impôt"
				engine={engine}
				documentationPath={`${absoluteSitePaths.assistants['choix-du-statut'].comparateur}/{name}`}
			>
				<HelpIcon />
			</StyledRuleLink>
		</StatusCard>
	)
}

/* 
<Condition
							engine={autoEntrepreneurEngine}
							expression="entreprise . chiffre d'affaires . seuil micro . dépassé"
						>
							<WarningTooltip
								tooltip={
									<StyledBody id="warning-ae-tooltip">
										<Trans>
											Vous allez dépasser le plafond de la micro-entreprise
										</Trans>{' '}
										<span>
											(
											<Value
												linkToRule={false}
												displayedUnit="€"
												expression={
													String(
														autoEntrepreneurEngine.evaluate(
															'entreprise . activité . nature'
														).nodeValue
													) === 'libérale'
														? "entreprise . chiffre d'affaires . seuil micro . libérale"
														: "entreprise . chiffre d'affaires . seuil micro . total"
												}
											/>{' '}
											<Trans>de chiffre d’affaires</Trans>).
										</span>
									</StyledBody>
								}
								id="tooltip-ae"
							/>
						</Condition>
						*/

/*

						footerContent={
							<CheckList
								items={[
									{
										isChecked: autoEntrepreneurEngine.evaluate({
											valeur: 'dirigeant . exonérations . ACRE',
										}).nodeValue as boolean,
										label: (
											<Trans i18nKey="revenu_après_impots.acre">
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
										isChecked: autoEntrepreneurEngine.evaluate({
											valeur:
												'dirigeant . auto-entrepreneur . impôt . versement libératoire',
										}).nodeValue as boolean,
										label: t("Versement libératoire de l'impôt sur le revenu"),
									},
								]}
							/>
							*/

export default RevenuAprèsImpot

const StyledRuleLink = styled(RuleLink)`
	display: inline-flex;
	margin-left: 0.15rem;
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

const StyledBody = styled(Body)`
	color: ${({ theme }) => theme.colors.extended.grey[100]}!important;
`
