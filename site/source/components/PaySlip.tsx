import { DottedName } from 'modele-social'
import {
	ASTNode,
	ParsedRules,
	Rule,
	RuleNode,
	formatValue,
	reduceAST,
} from 'publicodes'
import { Fragment, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import Value from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { EngineContext, useEngine } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system/typography'
import { H4, H5 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'

import { ExplicableRule } from './conversation/Explicable'

import './PaySlip.css'

import { Line, SalaireBrutSection, SalaireNetSection } from './PaySlipSections'

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
		.reduce((acc, cotisation: DottedName) => {
			const sectionName = getSection(parsedRules[cotisation])

			return {
				...acc,
				[sectionName]: (acc[sectionName] ?? new Set()).add(cotisation),
			}
		}, {} as Record<Section, Set<DottedName>>)

	return Object.entries(cotisations)
		.map(([section, dottedNames]) => [section, [...dottedNames.values()]])
		.sort(
			([a], [b]) =>
				SECTION_ORDER.indexOf(a as Section) -
				SECTION_ORDER.indexOf(b as Section)
		) as Array<[Section, DottedName[]]>
}

export default function PaySlip() {
	const parsedRules = useEngine().getParsedRules()
	const cotisationsBySection = getCotisationsBySection(parsedRules)

	const { t } = useTranslation()

	return (
		<div
			className="payslip__container"
			css={`
				.value {
					display: flex;
					align-items: flex-end;
					justify-content: flex-end;
					padding-right: 0.2em;
				}
			`}
		>
			<div className="payslip__salarySection">
				<Line
					rule="salarié . temps de travail"
					displayedUnit="heures/mois"
					precision={1}
				/>
				<Line
					rule="salarié . temps de travail . heures supplémentaires"
					displayedUnit="heures/mois"
					precision={1}
				/>
			</div>

			<SalaireBrutSection />
			{/* Section cotisations */}
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
								<Cotisation key={cotisation} dottedName={cotisation} />
							))}
						</Fragment>
					)
				})}
				{/* Réductions */}

				<RuleLink dottedName={'salarié . cotisations . exonérations'} />

				<Value
					expression="- salarié . cotisations . exonérations . employeur"
					unit="€/mois"
					displayedUnit="€"
				/>
				<Value
					expression="- salarié . cotisations . exonérations . salarié"
					unit="€/mois"
					displayedUnit="€"
				/>
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
			{/* Section salaire net */}
			<SalaireNetSection />
		</div>
	)
}

function findReferenceInNode(
	dottedName: DottedName,
	node: ASTNode
): string | undefined {
	return reduceAST<string | undefined>(
		(acc, node) => {
			if (
				node.nodeKind === 'reference' &&
				node.dottedName?.startsWith(dottedName) &&
				!node.dottedName.endsWith('$SITUATION')
			) {
				return node.dottedName
			} else if (node.nodeKind === 'reference') {
				return acc
			}
		},
		undefined,
		node
	)
}
function Cotisation({ dottedName }: { dottedName: DottedName }) {
	const language = useTranslation().i18n.language
	const engine = useContext(EngineContext)
	const partSalariale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule('salarié . cotisations . salarié')
		) ?? '0'
	)
	const partPatronale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule('salarié . cotisations . employeur')
		) ?? '0'
	)

	if (!partPatronale.nodeValue && !partSalariale.nodeValue) {
		return null
	}

	return (
		<>
			<RuleLink dottedName={dottedName} />
			<span>
				{partPatronale?.nodeValue
					? formatValue(partPatronale, { displayedUnit: '€', language })
					: '–'}
			</span>
			<span>
				{partSalariale?.nodeValue
					? formatValue(partSalariale, { displayedUnit: '€', language })
					: '–'}
			</span>
		</>
	)
}
