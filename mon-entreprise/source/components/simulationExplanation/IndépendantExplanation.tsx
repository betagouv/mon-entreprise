import BarChartBranch from 'Components/BarChart'
import 'Components/Distribution.css'
import Value, {
	Condition,
	WhenApplicable,
	WhenNotApplicable,
} from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import StackedBarChart from 'Components/StackedBarChart'
import { ThemeColorsContext } from 'Components/utils/colors'
import { useEngine } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import { max } from 'ramda'
import { useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { targetUnitSelector } from 'Selectors/simulationSelectors'
import CotisationsForfaitaires from './IndépendantCotisationsForfaitaires'
import CotisationsRégularisation from './IndépendantCotisationsRégularisation'
import PLExplanation from './PLExplanation'
import { DistributionSection } from './SalaryExplanation'

export default function IndépendantExplanation() {
	const { t } = useTranslation()
	const { palettes } = useContext(ThemeColorsContext)

	return (
		<>
			<WhenApplicable dottedName="dirigeant . indépendant . cotisations et contributions . début activité">
				<CotisationsForfaitaires />
			</WhenApplicable>
			<WhenNotApplicable dottedName="dirigeant . indépendant . cotisations et contributions . début activité">
				<CotisationsRégularisation />
			</WhenNotApplicable>
			<Condition expression="entreprise . activité . libérale réglementée">
				<PLExplanation />
			</Condition>
			<Condition expression="dirigeant . rémunération . nette après impôt > 0 €/an">
				<section>
					<h2>Répartition du revenu</h2>
					<StackedBarChart
						data={[
							{
								dottedName: 'dirigeant . rémunération . nette après impôt',
								title: t('Revenu disponible'),
								color: palettes[0][0],
							},
							{
								dottedName: 'impôt',
								color: palettes[1][0],
							},
							{
								dottedName:
									'dirigeant . indépendant . cotisations et contributions',
								color: palettes[1][1],
							},
						]}
					/>
				</section>
			</Condition>
			<Trans i18nKey="pages.simulateurs.indépendant.retraite-droits-acquis">
				<h2>Retraite : droits acquis sur l'année 2021</h2>
				<ul>
					<li>
						Retraite de base :{' '}
						<strong>
							<RuleLink dottedName="protection sociale . retraite . trimestres validés . trimestres indépendant">
								<Value
									expression="protection sociale . retraite . trimestres validés . trimestres indépendant"
									displayedUnit=""
								/>{' '}
								trimestres acquis
							</RuleLink>
						</strong>
					</li>
					<li>
						Retraite complémentaire :{' '}
						<Condition expression="entreprise . activité . libérale réglementée">
							<em>
								Ce simulateur ne gère pas les droits acquis de retraite
								complémentaire pour les professions libérales
							</em>
						</Condition>
						<Condition expression="entreprise . activité . libérale réglementée = non">
							<strong>
								<RuleLink dottedName="protection sociale . retraite . complémentaire indépendants . points acquis">
									<Value
										expression="protection sociale . retraite . complémentaire indépendants . points acquis"
										displayedUnit=""
									/>{' '}
									points acquis
								</RuleLink>
							</strong>
						</Condition>
					</li>
				</ul>
			</Trans>

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
			(cotisations as string[])
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
