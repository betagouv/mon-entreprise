import Value from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { EngineContext, useEngine } from '@/components/utils/EngineContext'
import { Strong } from '@/design-system/typography'
import { H4, H5 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { DottedName } from 'modele-social'
import {
	ASTNode,
	formatValue,
	ParsedRules,
	reduceAST,
	Rule,
	RuleNode,
} from 'publicodes'
import { Fragment, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ExplicableRule } from './conversation/Explicable'
import './PaySlip.css'
import { Line, SalaireBrutSection, SalaireNetSection } from './PaySlipSections'

export const SECTION_ORDER = [
	'protection sociale . santé',
	'protection sociale . accidents du travail et maladies professionnelles',
	'protection sociale . retraite',
	'protection sociale . famille',
	'protection sociale . assurance chômage',
	'protection sociale . formation',
	'protection sociale . transport',
	'protection sociale . autres',
] as const

type Section = typeof SECTION_ORDER[number]

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
					node.dottedName !== 'contrat salarié . cotisations' &&
					node.dottedName?.startsWith('contrat salarié . ') &&
					node.dottedName !==
						'contrat salarié . cotisations . patronales . réductions de cotisations'
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
			...findCotisations('contrat salarié . cotisations . patronales'),
			...findCotisations('contrat salarié . cotisations . salariales'),
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
					rule="contrat salarié . temps de travail"
					displayedUnit="heures/mois"
					precision={1}
				/>
				<Line
					rule="contrat salarié . temps de travail . heures supplémentaires"
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
					<Trans>Part employeur</Trans>
				</H4>
				<H4>
					<Trans>Part salarié</Trans>
				</H4>
				{cotisationsBySection.map(([sectionDottedName, cotisations]) => {
					const section = parsedRules[sectionDottedName]

					return (
						<Fragment key={section.dottedName}>
							<H5 className="payslip__cotisationTitle">
								{section.title}{' '}
								<em className="print-hidden">
									<ExplicableRule light dottedName={section.dottedName} />
								</em>
							</H5>
							{cotisations.map((cotisation) => (
								<Cotisation key={cotisation} dottedName={cotisation} />
							))}
						</Fragment>
					)
				})}
				{/* Réductions */}

				<RuleLink
					dottedName={
						'contrat salarié . cotisations . réductions de cotisations'
					}
				/>

				<Value
					expression="- contrat salarié . cotisations . patronales . réductions de cotisations"
					unit="€/mois"
					displayedUnit="€"
				/>
				<Value
					expression="- contrat salarié . cotisations . salariales . réductions de cotisations"
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
						expression="contrat salarié . cotisations . patronales"
						displayedUnit="€"
						className="payslip__total"
					/>
				</div>

				<Value
					expression="contrat salarié . cotisations . salariales"
					displayedUnit="€"
					className="payslip__total"
				/>
				{/* Salaire chargé */}
				<Line rule="contrat salarié . rémunération . total" />
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
				node.dottedName?.startsWith(dottedName)
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
			engine.getRule('contrat salarié . cotisations . salariales')
		) ?? '0'
	)
	const partPatronale = engine.evaluate(
		findReferenceInNode(
			dottedName,
			engine.getRule('contrat salarié . cotisations . patronales')
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
