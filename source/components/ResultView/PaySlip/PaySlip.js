/* @flow */
import React from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withLanguage from '../../withLanguage'
import './PaySlip.css'
import ficheDePaieSelector from './selectors'
import type { FicheDePaie } from './selectors'
// import type { Analysis } from '../../../types/State'

type ConnectedPropTypes = FicheDePaie

// const RuleLink = ({ link, name }) => {
// 	;<Link href={link}> name </Link>
// }

const Montant = withLanguage(
	({
		language,
		children: value,
		className = ''
	}: {
		language: string,
		className: string,
		children: number
	}) => (
		<span className={'payslip__montant ' + className}>
			{value === 0
				? '—'
				: Intl.NumberFormat(language, {
						style: 'currency',
						currency: 'EUR',
						maximumFractionDigits: 2,
						minimumFractionDigits: 2
				  }).format(value)}
		</span>
	)
)

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
					<Link to={salaireDeBase.lien}>{salaireDeBase.nom}</Link>
					<Montant>{salaireDeBase.montant}</Montant>
					<Link to={avantagesEnNature.lien}>{avantagesEnNature.nom}</Link>
					<Montant>{avantagesEnNature.montant}</Montant>
				</>
			) : null}
			<Link className="payslip__brut" to={salaireBrut.lien}>
				{salaireBrut.nom}
			</Link>
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
							<Link to={cotisation.lien}>{cotisation.nom}</Link>
							<Montant>{cotisation.montant.partPatronale}</Montant>
							<Montant>{cotisation.montant.partSalariale}</Montant>
						</>
					))}
				</>
			))}
			<h5 className="payslip__cotisationTitle">
				<Trans>Réductions</Trans>
			</h5>
			<Link to={réductionsDeCotisations.lien}>
				{réductionsDeCotisations.nom}
			</Link>
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
			<Link to={salaireChargé.lien}>{salaireChargé.nom}</Link>
			<Montant>{salaireChargé.montant}</Montant>
			<Montant>{0}</Montant>
		</div>
		{/* Section salaire net */}
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</h4>
			{/* Salaire net */}
			<Link to={salaireNet.lien}>{salaireNet.nom}</Link>
			<Montant>{salaireNet.montant}</Montant>
			{avantagesEnNature.montant !== 0 ? (
				<>
					{/* Avantages en nature */}
					<Link to={avantagesEnNature.lien}>{avantagesEnNature.nom}</Link>
					<Montant>{-avantagesEnNature.montant}</Montant>
					{/* Salaire net à payer */}
					<Link
						className="payslip__salaireNetàPayer"
						to={salaireNetàPayer.lien}>
						{salaireNetàPayer.nom}
					</Link>
					<Montant className="payslip__salaireNetàPayer">
						{salaireNetàPayer.montant}
					</Montant>
				</>
			) : null}
			{/* Salaire net imposable */}
			<Link to={salaireNetImposable.lien}>{salaireNetImposable.nom}</Link>
			<Montant>{salaireNetImposable.montant}</Montant>
		</div>
	</div>
)

export default connect(
	ficheDePaieSelector,
	{}
)(PaySlip)
