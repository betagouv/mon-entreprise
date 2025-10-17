import { ASTNode, ParsedRules, reduceAST, Rule, RuleNode } from 'publicodes'
import { Fragment } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { DottedName } from '@/domaine/publicodes/DottedName'

import './FicheDePaie.css'

import { H3 } from '@/design-system'
import { useEngine } from '@/hooks/useEngine'

import { ExplicableRule } from '../conversation/Explicable'
import Value from '../EngineValue/Value'
import { normalizeRuleName } from '../utils/normalizeRuleName'
import CotisationLine from './CotisationLine'

function CotisationLines({ cotisations }: { cotisations: Array<DottedName> }) {
	return cotisations.map((cotisation: DottedName) => (
		<CotisationLine key={cotisation} dottedName={cotisation} />
	))
}

export function Cotisations() {
	const { t } = useTranslation()
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(parsedRules)

	return (
		<section className="payslip__cotisationsSection">
			<H3>
				<Trans>Cotisations sociales</Trans>
			</H3>

			{cotisationsBySection.map(([sectionDottedName, cotisations]) => {
				const section = parsedRules[sectionDottedName]

				return (
					<Fragment key={section.dottedName}>
						<h4
							id={normalizeRuleName(section.dottedName)}
							className="payslip__cotisationTitle"
						>
							{section.title}
							<ExplicableRule light dottedName={section.dottedName} />
						</h4>
						<table
							className="payslip__cotisationTable"
							aria-labelledby={normalizeRuleName(section.dottedName)}
						>
							<tbody>
								<tr>
									<td></td>
									<th scope="col">{t('cotisations.employeur', 'employeur')}</th>
									<th scope="col">{t('cotisations.salarie', 'salarié')}</th>
								</tr>
								<CotisationLines cotisations={cotisations} />
							</tbody>
						</table>
					</Fragment>
				)
			})}

			{/* Total cotisation */}
			<h4 id="total_cotisation" className="payslip__cotisationTitle">
				<Trans>Total des cotisations et contributions</Trans>
				<ExplicableRule light dottedName="salarié . cotisations" />
			</h4>
			<table
				className="payslip__cotisationTable"
				aria-labelledby="total_cotisation"
			>
				<tbody>
					<tr>
						<td></td>
						<th scope="col">employeur</th>
						<th scope="col">salarié</th>
					</tr>
					<tr>
						<th scope="row" className="payslip__total-th">
							<Trans>Total des cotisations et contributions</Trans>
						</th>
						<td>
							<Value
								expression="salarié . cotisations . employeur"
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
						<td>
							<Value
								expression="salarié . cotisations . salarié"
								displayedUnit="€"
								className="payslip__total"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	)
}

export const SECTION_ORDER = [
	'salarié . cotisations . catégories . maladie',
	'salarié . cotisations . catégories . atmp',
	'salarié . cotisations . catégories . retraite',
	'salarié . cotisations . catégories . divers',
	'salarié . cotisations . catégories . convention collective',
	'salarié . cotisations . catégories . CSG-CRDS',
	'salarié . cotisations . catégories . exonérations',
	'salarié . cotisations . catégories . facultatives',
] as Array<DottedName>

type Section = (typeof SECTION_ORDER)[number]

function getSection(rule: RuleNode): Section {
	const section = `salarié . cotisations . catégories . ${
		(rule.rawNode as Rule & { cotisation?: { branche?: string } })?.cotisation
			?.branche ?? ''
	}` as Section
	if (SECTION_ORDER.includes(section)) {
		return section
	}

	return 'salarié . cotisations . catégories . divers'
}

export function getCotisationsBySection(
	parsedRules: ParsedRules<DottedName>
): Array<[Section, DottedName[]]> {
	function findCotisations(dottedName: DottedName) {
		return reduceAST<Array<ASTNode & { nodeKind: 'reference' }>>(
			(acc, node) => {
				if (
					node.nodeKind === 'reference' &&
					node.dottedName !== 'salarié . cotisations' &&
					node.dottedName?.startsWith('salarié . ') &&
					!node.dottedName?.endsWith('$SITUATION') &&
					node.dottedName !==
						'salarié . cotisations . patronales . réductions de cotisations'
				) {
					return [...acc, node]
				}
			},
			[],
			parsedRules[dottedName]
		)
	}

	const cotisations = (
		[
			...findCotisations('salarié . cotisations . employeur'),
			...findCotisations('salarié . cotisations . salarié'),
		] as Array<ASTNode & { dottedName: DottedName } & { nodeKind: 'reference' }>
	)
		.map((cotisation) => cotisation.dottedName)
		.filter(Boolean)
		.map(
			(dottedName) =>
				dottedName.replace(/ . (salarié|employeur)$/, '') as DottedName
		)
		.reduce(
			(acc, cotisation: DottedName) => {
				const sectionName = getSection(parsedRules[cotisation])

				return {
					...acc,
					[sectionName]: (acc[sectionName] ?? new Set()).add(cotisation),
				}
			},
			{} as Record<Section, Set<DottedName>>
		)

	return Object.entries(cotisations)
		.map(([section, dottedNames]) => [section, [...dottedNames.values()]])
		.sort(
			([a], [b]) =>
				SECTION_ORDER.indexOf(a as Section) -
				SECTION_ORDER.indexOf(b as Section)
		) as Array<[Section, DottedName[]]>
}
