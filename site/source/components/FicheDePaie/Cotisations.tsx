import { DottedName } from 'modele-social'
import { ASTNode, ParsedRules, reduceAST, Rule, RuleNode } from 'publicodes'
import { Fragment } from 'react'
import { Trans } from 'react-i18next'

import './FicheDePaie'

import { Strong } from '@/design-system/typography'
import { H4, H5 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import { ExplicableRule } from '../conversation/Explicable'
import Value from '../EngineValue/Value'
import { useEngine } from '../utils/EngineContext'
import CotisationLine from './CotisationLine'
import Line from './Line'

export function Cotisations() {
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(parsedRules)

	return (
		<>
			<div className="payslip__cotisationsSection">
				<H4>
					<Trans>Cotisations sociales</Trans>
				</H4>
				<H4>
					<Trans>employeur</Trans>
				</H4>
				<H4>
					<Trans>salarié</Trans>
				</H4>
				{cotisationsBySection.map(([sectionDottedName, cotisations]) => {
					const section = parsedRules[sectionDottedName]

					return (
						<Fragment key={section.dottedName}>
							<H5 className="payslip__cotisationTitle">
								{section.title}
								<ExplicableRule light dottedName={section.dottedName} />
							</H5>
							{cotisations.map((cotisation) => (
								<CotisationLine key={cotisation} dottedName={cotisation} />
							))}
						</Fragment>
					)
				})}

				{/* Total cotisation */}
				<Body className="payslip__total">
					<Strong>
						<Trans>Total des retenues</Trans>
					</Strong>
				</Body>
				<div>
					<Value
						expression="salarié . cotisations . employeur"
						displayedUnit="€"
						className="payslip__total"
					/>
				</div>
				<div>
					<Value
						expression="salarié . cotisations . salarié"
						displayedUnit="€"
						className="payslip__total"
					/>
				</div>

				{/* Salaire chargé */}
				<Line rule="salarié . coût total employeur" />
				<span />
			</div>
		</>
	)
}

export const SECTION_ORDER = [
	'protection sociale . maladie',
	'protection sociale . accidents du travail et maladies professionnelles',
	'protection sociale . retraite',
	'protection sociale . famille',
	'protection sociale . assurance chômage',
	'protection sociale . formation',
	'protection sociale . transport',
	'protection sociale . autres',
] as Array<DottedName>

type Section = (typeof SECTION_ORDER)[number]

function getSection(rule: RuleNode): Section {
	const section = `protection sociale . ${
		(rule.rawNode as Rule & { cotisation?: { branche?: string } })?.cotisation
			?.branche ?? ''
	}` as Section
	if (SECTION_ORDER.includes(section)) {
		return section
	}

	return 'protection sociale . autres'
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
