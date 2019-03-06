/* @flow */
import type { FicheDePaie } from 'Types/ResultViewTypes'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import { compose } from 'ramda'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { analysisToCotisationsSelector } from 'Selectors/ficheDePaieSelectors'
import {
	getRuleFromAnalysis,
	analysisWithDefaultsSelector
} from 'Selectors/analyseSelectors'
import Montant from 'Ui/Montant'
import './PaySlip.css'
import RuleLink from './RuleLink'
import { Line, SalaireNetSection, SalaireBrutSection } from './PaySlipSections'

type ConnectedPropTypes = ?FicheDePaie & {
	colours: { lightestColour: string }
}

export default compose(
	withColours,
	connect(state => ({
		cotisations: analysisToCotisationsSelector(state),
		analysis: analysisWithDefaultsSelector(state)
	})),
	withLanguage
)(
	({
		colours: { lightestColour },
		cotisations,
		analysis
	}: ConnectedPropTypes) => {
		let getRule = getRuleFromAnalysis(analysis)

		return (
			<div className="payslip__container">
				<div className="payslip__hourSection">
					<Trans i18nKey="payslip.heures">Heures travaillées par mois : </Trans>
					<span className="montant">
						{Math.round(
							getRule('contrat salarié . temps partiel . heures par semaine')
								.nodeValue * 4.33
						)}
					</span>
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
					{cotisations.map(([branche, cotisationList]) => (
						<Fragment key={branche.id}>
							<h5 className="payslip__cotisationTitle">
								<RuleLink {...branche} />
							</h5>
							{cotisationList.map(cotisation => (
								<Fragment key={cotisation.lien}>
									<RuleLink
										style={{ backgroundColor: lightestColour }}
										{...cotisation}
									/>
									<Montant style={{ backgroundColor: lightestColour }}>
										{cotisation.montant.partPatronale}
									</Montant>
									<Montant style={{ backgroundColor: lightestColour }}>
										{cotisation.montant.partSalariale}
									</Montant>
								</Fragment>
							))}
						</Fragment>
					))}
					<h5 className="payslip__cotisationTitle">
						<Trans>Réductions</Trans>
					</h5>
					<Line rule={getRule('')} />
					<Line
						sign="-"
						rule={getRule('contrat salarié . réductions de cotisations')}
					/>
					<Montant>{0}</Montant>
					{/* Total cotisation */}
					<div className="payslip__total">
						<Trans>Total des retenues</Trans>
					</div>
					<Montant className="payslip__total">
						{getRule('contrat salarié . cotisations patronales à payer')}
					</Montant>
					<Montant className="payslip__total">
						{getRule('contrat salarié . cotisations salariales')}
					</Montant>
					{/* Salaire chargé */}
					<Line rule={getRule('contrat salarié . rémunération . total')} />
					<Montant>{0}</Montant>
				</div>
				{/* Section salaire net */}
				<SalaireNetSection getRule={getRule} />
				<br />
				<p className="ui__ notice">
					<Trans i18nKey="payslip.notice">
						Le simulateur vous aide à comprendre votre bulletin de paie, sans
						lui être opposable. Pour plus d&apos;informations, rendez vous
						sur&nbsp;
						<a
							alt="service-public.fr"
							href="https://www.service-public.fr/particuliers/vosdroits/F559">
							service-public.fr
						</a>
						.
					</Trans>
				</p>
				<p className="ui__ notice">
					<Trans i18nKey="payslip.disclaimer">
						Il ne prend pour l'instant pas en compte les accords et conventions
						collectives, ni la myriade d'aides aux entreprises. Trouvez votre
						convention collective{' '}
						<a href="https://socialgouv.github.io/conventions-collectives">
							ici
						</a>
						, et explorez les aides sur&nbsp;
						<a href="https://www.aides-entreprises.fr">aides-entreprises.fr</a>.
					</Trans>
				</p>
			</div>
		)
	}
)
