import Value from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import { EngineContext, useEvaluation } from 'Components/utils/EngineContext'
import { formatValue, ParsedRule, ParsedRules } from 'publicodes'
import React, { Fragment, useContext } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
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
	'protection sociale . autres'
] as const

type Section = typeof SECTION_ORDER[number]

function getSection(rule: ParsedRule): Section {
	const section = ('protection sociale . ' +
		rule.cotisation?.branche) as Section
	if (SECTION_ORDER.includes(section)) {
		return section
	}
	return 'protection sociale . autres'
}

export function getCotisationsBySection(
	parsedRules: ParsedRules
): Array<[Section, DottedName[]]> {
	const cotisations = [
		...parsedRules['contrat salarié . cotisations . patronales'].formule
			.explanation.explanation,
		...parsedRules['contrat salarié . cotisations . salariales'].formule
			.explanation.explanation
	]
		.map(cotisation => cotisation.dottedName)
		.filter(Boolean)
		.reduce((acc, cotisation: DottedName) => {
			const sectionName = getSection(parsedRules[cotisation])
			return {
				...acc,
				[sectionName]: (acc[sectionName] ?? new Set()).add(cotisation)
			}
		}, {}) as Record<Section, Set<DottedName>>

	return Object.entries(cotisations)
		.map(([section, dottedNames]) => [section, [...dottedNames.values()]])
		.sort(
			([a], [b]) =>
				SECTION_ORDER.indexOf(a as Section) -
				SECTION_ORDER.indexOf(b as Section)
		) as Array<[Section, DottedName[]]>
}

export default function PaySlip() {
	const parsedRules = useContext(EngineContext).getParsedRules()
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
				<h4>
					<Trans>Cotisations sociales</Trans>
				</h4>
				<h4>
					<Trans>Part employeur</Trans>
				</h4>
				<h4>
					<Trans>Part salarié</Trans>
				</h4>
				{cotisationsBySection.map(([sectionDottedName, cotisations]) => {
					const section = parsedRules[sectionDottedName]
					return (
						<Fragment key={section.dottedName}>
							<h5 className="payslip__cotisationTitle">
								<RuleLink dottedName={section.dottedName} />
							</h5>
							{cotisations.map(cotisation => (
								<Cotisation key={cotisation} dottedName={cotisation} />
							))}
						</Fragment>
					)
				})}
				{/* Réductions */}
				<div>
					<RuleLink
						dottedName={
							'contrat salarié . cotisations . réductions de cotisations'
						}
					/>
				</div>
				<Value
					expression="- contrat salarié . cotisations . patronales . réductions de cotisations"
					displayedUnit="€"
				/>
				<Value
					expression="- contrat salarié . cotisations . salariales . réductions de cotisations"
					displayedUnit="€"
				/>
				{/* Total cotisation */}
				<p className="payslip__total">
					<Trans>Total des retenues</Trans>
				</p>
				<Value
					expression="contrat salarié . cotisations . patronales"
					displayedUnit="€"
					className="payslip__total"
				/>
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

function Cotisation({ dottedName }: { dottedName: DottedName }) {
	const language = useTranslation().i18n.language
	const partSalariale = useEvaluation(
		'contrat salarié . cotisations . salariales'
	)?.formule.explanation.explanation.find(
		(cotisation: ParsedRule) => cotisation.dottedName === dottedName
	)
	const partPatronale = useEvaluation(
		'contrat salarié . cotisations . patronales'
	)?.formule.explanation.explanation.find(
		(cotisation: ParsedRule) => cotisation.dottedName === dottedName
	)
	if (!partPatronale?.nodeValue && !partSalariale?.nodeValue) {
		return null
	}
	return (
		<>
			<RuleLink
				dottedName={dottedName}
				style={{ backgroundColor: 'var(--lightestColor)' }}
			/>
			<span style={{ backgroundColor: 'var(--lightestColor)' }}>
				{partPatronale?.nodeValue
					? formatValue(partPatronale, { displayedUnit: '€', language })
					: '–'}
			</span>
			<span style={{ backgroundColor: 'var(--lightestColor)' }}>
				{partSalariale?.nodeValue
					? formatValue(partSalariale, { displayedUnit: '€', language })
					: '–'}
			</span>
		</>
	)
}
