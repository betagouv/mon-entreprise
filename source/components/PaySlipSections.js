import { React, T } from 'Components'
import RuleLink from './RuleLink'
import Montant from 'Ui/Montant'

export let SalaireBrutSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
			'contrat salarié . avantages en nature . montant'
		),
		indemnitésSalarié = getRule('contrat salarié . indemnités salarié'),
		salaireDeBase = getRule('contrat salarié . salaire . brut de base'),
		salaireBrut = getRule('contrat salarié . salaire . brut')

	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire</T>
			</h4>
			{(avantagesEnNature.nodeValue !== 0 ||
				indemnitésSalarié.nodeValue !== 0) && (
				<>
					<RuleLink {...salaireDeBase} />
					<Montant>{salaireDeBase}</Montant>
				</>
			)}
			{avantagesEnNature.nodeValue !== 0 && (
				<>
					<RuleLink {...avantagesEnNature} />
					<Montant>{avantagesEnNature}</Montant>
				</>
			)}
			{indemnitésSalarié.nodeValue !== 0 && (
				<>
					<RuleLink {...indemnitésSalarié} />
					<Montant>{indemnitésSalarié}</Montant>
				</>
			)}
			<RuleLink className="payslip__brut" {...salaireBrut} />
			<Montant className="payslip__brut">{salaireBrut}</Montant>
		</div>
	)
}

export let Line = ({ rule }) => (
	<>
		<RuleLink {...rule} />
		<Montant>{rule}</Montant>
	</>
)

export let SalaireNetSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
		'contrat salarié . avantages en nature . montant'
	)
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire net</T>
			</h4>
			<Line rule={getRule('contrat salarié . rémunération . net imposable')} />
			<Line
				rule={getRule('contrat salarie . rémunération . net de cotisations')}
			/>
			{avantagesEnNature.nodeValue !== 0 ? (
				<>
					{/* Avantages en nature */}
					<Line sign="-" rule={avantagesEnNature} />
					{/* Salaire net */}
					<Line sign="-" rule={getRule('contrat salarié . salaire . net')} />
				</>
			) : null}
			<Line sign="-" rule={getRule('impôt . neutre')} />
			<Line rule={getRule('contrat salarié . salaire . net après impôt')} />
		</div>
	)
}
