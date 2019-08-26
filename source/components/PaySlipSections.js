import { React, T } from 'Components'
import Value from 'Components/Value'
import RuleLink from './RuleLink'

export let SalaireBrutSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
			'contrat salarié . avantages en nature . montant'
		),
		indemnitésSalarié = getRule('contrat salarié . indemnités salarié'),
		heuresSupplémentaires = getRule(
			'contrat salarié . rémunération . heures supplémentaires'
		),
		salaireDeBase = getRule('contrat salarié . salaire . brut de base'),
		rémunérationBrute = getRule('contrat salarié . rémunération . brut')

	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire</T>
			</h4>
			<Line rule={salaireDeBase} />
			{avantagesEnNature.nodeValue !== 0 && <Line rule={avantagesEnNature} />}
			{indemnitésSalarié.nodeValue !== 0 && <Line rule={indemnitésSalarié} />}
			{heuresSupplémentaires.nodeValue !== 0 && (
				<Line rule={heuresSupplémentaires} />
			)}
			{rémunérationBrute.nodeValue !== salaireDeBase.nodeValue && (
				<Line rule={rémunérationBrute} />
			)}
		</div>
	)
}

export let Line = ({ rule, ...props }) => (
	<>
		<RuleLink {...rule} />
		<Value {...rule} nilValueSymbol="—" {...props} />
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
				rule={getRule('contrat salarié . rémunération . net de cotisations')}
			/>
			{avantagesEnNature.nodeValue !== 0 ? (
				<>
					{/* Avantages en nature */}
					<Line negative rule={avantagesEnNature} />
					{/* Salaire net */}
					<Line rule={getRule('contrat salarié . salaire . net')} />
				</>
			) : null}
			<Line negative rule={getRule('impôt')} />
			<Line rule={getRule('contrat salarié . salaire . net après impôt')} />
		</div>
	)
}
