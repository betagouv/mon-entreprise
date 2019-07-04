/* @flow */
import type { FicheDePaie } from 'Types/ResultViewTypes'
import withColours from 'Components/utils/withColours'
import { compose } from 'ramda'
import React, { Fragment } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import FicheDePaieSelectors from 'Selectors/ficheDePaieSelectors'
import Montant from 'Ui/Montant'
import './PaySlip.css'
import RuleLink from './RuleLink'

type ConnectedPropTypes = ?FicheDePaie & {
	colours: { lightestColour: string }
}

const PaySlip = ({
	colours: { lightestColour },
	...ficheDePaie
}: ConnectedPropTypes) => {
	if (!Object.values(ficheDePaie).length) {
		return null
	}
	const {
		salaireBrut,
		avantagesEnNature,
		salaireNetDeCotisations,
		salaireDeBase,
		salaireChargé,
		indemnitésSalarié,
		rémunérationNetteImposable,
		nombreHeuresTravaillées,
		salaireNet,
		réductionsDeCotisations,
		cotisations,
		totalCotisations,
		salaireNetAprèsImpôt,
		impôt
	} = ficheDePaie
	return (
		<div className="payslip__container">
			<div className="payslip__hourSection">
				<Trans i18nKey="payslip.heures">Heures travaillées par mois : </Trans>
				<span className="montant"> {nombreHeuresTravaillées}</span>
			</div>
			{/* Section salaire brut */}
			<div className="payslip__salarySection">
				<h4 className="payslip__salaryTitle">
					<Trans>Salaire</Trans>
				</h4>
				{(avantagesEnNature.montant !== 0 ||
					indemnitésSalarié.montant !== 0) && (
					<>
						<RuleLink {...salaireDeBase} />
						<Montant>{salaireDeBase.montant}</Montant>
					</>
				)}
				{avantagesEnNature.montant !== 0 && (
					<>
						<RuleLink {...avantagesEnNature} />
						<Montant>{avantagesEnNature.montant}</Montant>
					</>
				)}
				{indemnitésSalarié.montant !== 0 && (
					<>
						<RuleLink {...indemnitésSalarié} />
						<Montant>{indemnitésSalarié.montant}</Montant>
					</>
				)}
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
				{/* Rémunération nette imposable */}
				<RuleLink {...rémunérationNetteImposable} />
				<Montant>{rémunérationNetteImposable.montant}</Montant>
				{/* Salaire net */}
				<RuleLink {...salaireNetDeCotisations} />
				<Montant>{salaireNetDeCotisations.montant}</Montant>
				{avantagesEnNature.montant !== 0 ? (
					<>
						{/* Avantages en nature */}
						<RuleLink {...avantagesEnNature} />
						<Montant>{-avantagesEnNature.montant}</Montant>
						{/* Salaire net */}
						<RuleLink className="payslip__salaireNet" {...salaireNet} />
						<Montant className="payslip__salaireNet">
							{salaireNet.montant}
						</Montant>
					</>
				) : null}
				<RuleLink {...impôt} />
				<Montant>{-impôt.montant}</Montant>
				<RuleLink {...salaireNetAprèsImpôt} />
				<Montant>{salaireNetAprèsImpôt.montant}</Montant>
			</div>
		</div>
	)
}

export default compose(
	withColours,
	connect(
		FicheDePaieSelectors,
		{}
	)
)(PaySlip)
