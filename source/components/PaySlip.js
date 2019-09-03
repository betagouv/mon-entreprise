/* @flow */
import type { FicheDePaie } from 'Types/ResultViewTypes'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import Value from 'Components/Value'
import { findRuleByDottedName, getRuleFromAnalysis } from 'Engine/rules'
import { compose } from 'ramda'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import {
	analysisWithDefaultsSelector,
	parsedRulesSelector
} from 'Selectors/analyseSelectors'
import { analysisToCotisationsSelector } from 'Selectors/ficheDePaieSelectors'
import './PaySlip.css'
import { Line, SalaireBrutSection, SalaireNetSection } from './PaySlipSections'
import RuleLink from './RuleLink'

type ConnectedPropTypes = ?FicheDePaie & {
	colours: { lightestColour: string }
}

export default compose(
	withColours,
	connect(state => ({
		cotisations: analysisToCotisationsSelector(state),
		analysis: analysisWithDefaultsSelector(state),
		parsedRules: parsedRulesSelector(state)
	})),
	withLanguage
)(
	({
		colours: { lightestColour },
		cotisations,
		analysis,
		parsedRules
	}: ConnectedPropTypes) => {
		let getRule = getRuleFromAnalysis(analysis)

		const heuresSupplémentaires = getRule(
			'contrat salarié . temps de travail . heures supplémentaires'
		)
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
				`}>
				<div className="payslip__salarySection">
					<Line
						rule={getRule('contrat salarié . temps de travail')}
						maximumFractionDigits={1}
					/>
					{heuresSupplémentaires.nodeValue > 0 && (
						<Line rule={heuresSupplémentaires} maximumFractionDigits={1} />
					)}
				</div>

				<SalaireBrutSection getRule={getRule} />
				{/* Section cotisations */}
				<div className="payslip__cotisationsSection">
					<h4>
						<Trans>Cotisations sociales</Trans>
					</h4>
					<h4>
						<Trans>Part employeur</Trans>
					</h4>
					<h4>
						<Trans>Part salariale</Trans>
					</h4>
					{cotisations.map(([brancheDottedName, cotisationList]) => {
						let branche = findRuleByDottedName(parsedRules, brancheDottedName)
						return (
							<Fragment key={branche.dottedName}>
								<h5 className="payslip__cotisationTitle">
									<RuleLink {...branche} />
								</h5>
								{cotisationList.map(cotisation => (
									<Fragment key={cotisation.dottedName}>
										<RuleLink
											style={{ backgroundColor: lightestColour }}
											{...cotisation}
										/>
										<Value
											nilValueSymbol="—"
											unit="€"
											customCSS="background-color: var(--lightestColour)">
											{cotisation.montant.partPatronale}
										</Value>
										<Value
											nilValueSymbol="—"
											unit="€"
											customCSS="background-color: var(--lightestColour)">
											{cotisation.montant.partSalariale}
										</Value>
									</Fragment>
								))}
							</Fragment>
						)
					})}

					<Line
						negative
						rule={getRule(
							'contrat salarié . cotisations . patronales . réductions de cotisations'
						)}
					/>
					<span />

					{/* Total cotisation */}
					<div className="payslip__total">
						<Trans>Total des retenues</Trans>
					</div>
					<Value
						nilValueSymbol="—"
						{...getRule('contrat salarié . cotisations . patronales . à payer')}
						unit="€"
						className="payslip__total"
					/>
					<Value
						nilValueSymbol="—"
						{...getRule('contrat salarié . cotisations . salariales')}
						unit="€"
						className="payslip__total"
					/>
					{/* Salaire chargé */}
					<Line rule={getRule('contrat salarié . rémunération . total')} />
					<span />
				</div>
				{/* Section salaire net */}
				<SalaireNetSection getRule={getRule} />
			</div>
		)
	}
)
