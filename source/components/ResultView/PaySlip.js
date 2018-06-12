/* @flow */
import { compose } from 'ramda'
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import withColours from '../withColours'
import Montant from './Montant'
import './PaySlip.css'
import RuleLink from './RuleLink'
import { ficheDePaieSelector } from './selectors'
import type { FicheDePaie } from './types'

type ConnectedPropTypes = FicheDePaie & { colours: { lightestColour: string } }

const PaySlip = ({
	salaireBrut,
	avantagesEnNature,
	salaireNet,
	salaireDeBase,
	salaireChargé,
	salaireNetImposable,
	salaireNetàPayer,
	réductionsDeCotisations,
	cotisations,
	colours: { lightestColour },
	totalCotisations
}: ConnectedPropTypes) => (
	<div className="payslip__container">
		{/* Section salaire brut */}
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire</Trans>
			</h4>
			{avantagesEnNature.montant !== 0 ? (
				<>
					<RuleLink {...salaireDeBase} />
					<Montant>{salaireDeBase.montant}</Montant>
					<RuleLink {...avantagesEnNature} />
					<Montant>{avantagesEnNature.montant}</Montant>
				</>
			) : null}
			<RuleLink className="payslip__brut" {...salaireBrut} />
			<Montant className="payslip__brut">{salaireBrut.montant}</Montant>
		</div>
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
			{cotisations.map(([section, cotisationList]) => (
				<>
					<h5 className="payslip__cotisationTitle">
						<Trans>{section}</Trans>
					</h5>
					{cotisationList.map(cotisation => (
						<>
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
						</>
					))}
				</>
			))}
			<h5 className="payslip__cotisationTitle">
				<Trans>Réductions</Trans>
			</h5>
			<RuleLink {...réductionsDeCotisations} />
			<Montant>{-réductionsDeCotisations.montant}</Montant>
			<Montant>{0}</Montant>
			{/* Total cotisation */}
			<div className="payslip__total">
				<Trans>Total des retenues</Trans>
			</div>
			<Montant className="payslip__total">
				{totalCotisations.partPatronale}
			</Montant>
			<Montant className="payslip__total">
				{totalCotisations.partSalariale}
			</Montant>
			{/* Salaire chargé */}
			<RuleLink {...salaireChargé} />
			<Montant>{salaireChargé.montant}</Montant>
			<Montant>{0}</Montant>
		</div>
		{/* Section salaire net */}
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</h4>
			{/* Salaire net */}
			<RuleLink {...salaireNet} />
			<Montant>{salaireNet.montant}</Montant>
			{avantagesEnNature.montant !== 0 ? (
				<>
					{/* Avantages en nature */}
					<RuleLink {...avantagesEnNature} />
					<Montant>{-avantagesEnNature.montant}</Montant>
					{/* Salaire net à payer */}
					<RuleLink
						className="payslip__salaireNetàPayer"
						{...salaireNetàPayer}
					/>
					<Montant className="payslip__salaireNetàPayer">
						{salaireNetàPayer.montant}
					</Montant>
				</>
			) : null}
			{/* Salaire net imposable */}
			<RuleLink {...salaireNetImposable} />
			<Montant>{salaireNetImposable.montant}</Montant>
		</div>
	</div>
)

export default compose(
	withColours,
	connect(
		ficheDePaieSelector,
		{}
	)
)(PaySlip)
