import BarChartBranch from 'Components/BarChart'
import 'Components/Distribution.css'
import Value, {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import StackedBarChart from 'Components/StackedBarChart'
import { useEngine } from 'Components/utils/EngineContext'
import { Strong } from 'DesignSystem/typography'
import { H3 } from 'DesignSystem/typography/heading'
import { Li, Ul } from 'DesignSystem/typography/list'
import { SmallBody } from 'DesignSystem/typography/paragraphs'
import { DottedName } from 'modele-social'
import { max } from 'ramda'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import { ThemeContext } from 'styled-components'
import CotisationsForfaitaires from './IndépendantCotisationsForfaitaires'
import CotisationsRégularisation from './IndépendantCotisationsRégularisation'
import InstitutionsPartenaires from './InstitutionsPartenaires'
import { DistributionSection } from './SalaryExplanation'

export default function IndépendantExplanation() {
	const { t } = useTranslation()
	const { colors } = useContext(ThemeContext)

	return (
		<>
			<section>
				<WhenApplicable dottedName="dirigeant . indépendant . cotisations et contributions . début activité">
					<CotisationsForfaitaires />
				</WhenApplicable>
				<WhenNotApplicable dottedName="dirigeant . indépendant . cotisations et contributions . début activité">
					<CotisationsRégularisation />
				</WhenNotApplicable>
			</section>
			<Condition expression="dirigeant . rémunération . nette après impôt > 0 €/an">
				<section>
					<H3 as="h2">Répartition du revenu</H3>
					<StackedBarChart
						data={[
							{
								dottedName: 'dirigeant . rémunération . nette après impôt',
								title: t('Revenu disponible'),
								color: colors.bases.primary[600],
							},
							{
								dottedName: 'impôt . montant',
								title: t('impôt sur le revenu'),
								color: colors.bases.secondary[500],
							},
							{
								dottedName:
									'dirigeant . indépendant . cotisations et contributions',
								color: colors.bases.secondary[300],
							},
						]}
					/>
				</section>
			</Condition>
			<InstitutionsPartenaires />
			<DroitsRetraite />
			<DistributionSection>
				<Distribution />
			</DistributionSection>
		</>
	)
}

const CotisationsSection: Partial<Record<DottedName, Array<string>>> = {
	'protection sociale . retraite': [
		'dirigeant . indépendant . cotisations et contributions . retraite de base',
		'dirigeant . indépendant . cotisations et contributions . retraite complémentaire',
		'dirigeant . indépendant . cotisations et contributions . PCV',
	],
	'protection sociale . santé': [
		'dirigeant . indépendant . cotisations et contributions . maladie',
		'dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie',
		'dirigeant . indépendant . cotisations et contributions . CSG et CRDS * 5.95 / 9.2',
	],
	'protection sociale . invalidité et décès': [
		'dirigeant . indépendant . cotisations et contributions . invalidité et décès',
	],
	'protection sociale . famille': [
		'dirigeant . indépendant . cotisations et contributions . allocations familiales',
		'dirigeant . indépendant . cotisations et contributions . CSG et CRDS * 0.95 / 9.2',
	],
	'protection sociale . autres': [
		'dirigeant . indépendant . cotisations et contributions . contributions spéciales',
		'dirigeant . indépendant . cotisations et contributions . CSG et CRDS * 2.3 / 9.2',
	],
	'protection sociale . formation': [
		'dirigeant . indépendant . cotisations et contributions . formation professionnelle',
	],
}

function Distribution() {
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useEngine()
	const distribution = (
		Object.entries(CotisationsSection).map(([section, cotisations]) => [
			section,
			cotisations
				.map((c) => engine.evaluate({ valeur: c, unité: targetUnit }))
				.reduce(
					(acc, evaluation) => acc + ((evaluation?.nodeValue as number) || 0),
					0
				),
		]) as Array<[DottedName, number]>
	)
		.filter(([, value]) => value > 0)
		.sort(([, a], [, b]) => b - a)

	const maximum = distribution.map(([, value]) => value).reduce(max, 0)

	return (
		<>
			<div className="distribution-chart__container">
				{distribution.map(([sectionName, value]) => (
					<DistributionBranch
						key={sectionName}
						dottedName={sectionName}
						value={value}
						maximum={maximum}
					/>
				))}
			</div>
		</>
	)
}

type DistributionBranchProps = {
	dottedName: DottedName
	value: number
	maximum: number
	icon?: string
}

function DistributionBranch({
	dottedName,
	value,
	icon,
	maximum,
}: DistributionBranchProps) {
	const branche = useEngine().getRule(dottedName)

	return (
		<BarChartBranch
			value={value}
			maximum={maximum}
			title={<RuleLink dottedName={dottedName} />}
			icon={icon ?? branche.rawNode.icônes}
			description={branche.rawNode.résumé}
			unit="€"
		/>
	)
}

function DroitsRetraite() {
	/** Le simulateur ne doit pas faire apparaître les droits à la retraite sur secu-independant.fr */
	if (
		document.referrer?.includes('secu-independants.fr') ||
		document.referrer?.includes('simulateur-rsi.urssaf.fr')
	) {
		return null
	}
	return (
		<Trans i18nKey="pages.simulateurs.indépendant.retraite-droits-acquis">
			<H3 as="h2">Retraite : droits acquis sur l'année</H3>
			<Ul>
				<Li>
					Retraite de base :{' '}
					<RuleLink dottedName="protection sociale . retraite . trimestres validés . trimestres indépendant">
						<Value
							expression="protection sociale . retraite . trimestres validés . trimestres indépendant"
							displayedUnit=""
						/>{' '}
						trimestres acquis
					</RuleLink>
				</Li>
				<Li>
					Retraite complémentaire :{' '}
					<WhenApplicable dottedName="protection sociale . retraite . complémentaire indépendants . points acquis">
						<RuleLink dottedName="protection sociale . retraite . complémentaire indépendants . points acquis">
							<Value
								expression="protection sociale . retraite . complémentaire indépendants . points acquis"
								displayedUnit=""
							/>{' '}
							points acquis
						</RuleLink>
					</WhenApplicable>
					<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire indépendants . points acquis">
						<Strong>non connue</Strong>
						<WhenApplicable dottedName="dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité">
							<SmallBody>
								Le nombre de "points gratuits" reçus pendant votre pension
								d'invalidité dépend de vos revenus antérieurs.{' '}
								<RuleLink dottedName="dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité">
									En savoir plus.
								</RuleLink>
							</SmallBody>
						</WhenApplicable>
						<WhenApplicable dottedName="dirigeant . indépendant . PL . CNAVPL">
							<SmallBody>
								Ce simulateur ne gère pas les droits acquis de retraite
								complémentaire pour les professions libérales
							</SmallBody>
						</WhenApplicable>
					</WhenNotApplicable>
				</Li>
			</Ul>
		</Trans>
	)
}
