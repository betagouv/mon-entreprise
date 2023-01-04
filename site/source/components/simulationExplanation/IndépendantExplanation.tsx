import BarChartBranch from '@/components/BarChart'

import '@/components/Distribution.css'

import { DottedName } from 'modele-social'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { ThemeContext } from 'styled-components'

import Value, {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import StackedBarChart from '@/components/StackedBarChart'
import { useEngine } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system/typography'
import { H3 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { SmallBody } from '@/design-system/typography/paragraphs'
import { targetUnitSelector } from '@/selectors/simulationSelectors'

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
			<Condition expression="dirigeant . rémunération . net . après impôt > 0 €/an">
				<section>
					<H3 as="h2">Répartition du revenu</H3>
					<StackedBarChart
						data={[
							{
								dottedName: 'dirigeant . rémunération . net . après impôt',
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
	'protection sociale . maladie': [
		'dirigeant . indépendant . cotisations et contributions . maladie',
		'dirigeant . indépendant . cotisations et contributions . indemnités journalières maladie',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 5.95 / 9.2',
	],
	'protection sociale . invalidité et décès': [
		'dirigeant . indépendant . cotisations et contributions . invalidité et décès',
	],
	'protection sociale . famille': [
		'dirigeant . indépendant . cotisations et contributions . allocations familiales',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 0.95 / 9.2',
	],
	'protection sociale . autres': [
		'dirigeant . indépendant . cotisations et contributions . contributions spéciales',
		'dirigeant . indépendant . cotisations et contributions . CSG-CRDS * 2.3 / 9.2',
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

	const maximum = Math.max(...distribution.map(([, value]) => value))

	return (
		<>
			<div className="distribution-chart__container" role="list">
				{distribution.map(([sectionName, value]) => (
					<DistributionBranch
						key={sectionName}
						dottedName={sectionName}
						value={value}
						maximum={maximum}
						role="listitem"
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
	role?: string
}

function DistributionBranch({
	dottedName,
	value,
	icon,
	maximum,
	...props
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
			{...props}
		/>
	)
}

function DroitsRetraite() {
	const { t } = useTranslation()

	return (
		<Trans i18nKey="pages.simulateurs.indépendant.retraite-droits-acquis">
			<H3 as="h2">Retraite : droits acquis sur l'année</H3>
			<Ul>
				<Li>
					Retraite de base :{' '}
					<Value
						expression="protection sociale . retraite . trimestres"
						displayedUnit={t('trimestres acquis')}
					/>
				</Li>
				<WhenApplicable dottedName="protection sociale . retraite . base . CNAVPL">
					<Li>
						Points de retraite de base acquis (CNAVPL) :{' '}
						<Value
							linkToRule
							expression="protection sociale . retraite . base . CNAVPL"
							displayedUnit={t('points')}
						/>
					</Li>
				</WhenApplicable>
				<WhenNotApplicable dottedName="protection sociale . retraite . base . CNAVPL">
					<Li>
						Revenu cotisé pris en compte pour la retraite de base :{' '}
						<Value
							linkToRule
							unit="€/an"
							expression="protection sociale . retraite . base"
						/>
					</Li>
				</WhenNotApplicable>
				<Li>
					Points de retraite complémentaire acquis :{' '}
					<WhenApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
						<Value
							expression="protection sociale . retraite . complémentaire . RCI . points acquis"
							displayedUnit=""
						/>{' '}
						points acquis
					</WhenApplicable>
					<WhenNotApplicable dottedName="protection sociale . retraite . complémentaire . RCI . points acquis">
						<Strong>non connue</Strong>
						<Condition expression="dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité">
							<SmallBody>
								Le nombre de "points gratuits" reçus pendant votre pension
								d'invalidité dépend de vos revenus antérieurs.{' '}
								<RuleLink dottedName="dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité">
									En savoir plus.
								</RuleLink>
							</SmallBody>
						</Condition>
						<WhenApplicable dottedName="dirigeant . indépendant . PL">
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
