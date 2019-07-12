import { React, T } from 'Components'
import RuleLink from './RuleLink'
import Value from 'Components/Value'

export let SalaireBrutSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
			'contrat salarié . avantages en nature . montant'
		),
		indemnitésSalarié = getRule('contrat salarié . indemnités salarié'),
		salaireDeBase = getRule('contrat salarié . salaire . brut de base'),
		rémunérationBrute = getRule('contrat salarié . rémunération . brut')

	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire</T>
			</h4>
			{(avantagesEnNature.nodeValue !== 0 ||
				indemnitésSalarié.nodeValue !== 0) && <Line rule={salaireDeBase} />}
			{avantagesEnNature.nodeValue !== 0 && <Line rule={avantagesEnNature} />}
			{indemnitésSalarié.nodeValue !== 0 && <Line rule={indemnitésSalarié} />}
			<RuleLink className="payslip__brut" {...rémunérationBrute} />
			<Value className="payslip__brut" {...rémunérationBrute} unit="€" />
		</div>
	)
}

export let Line = ({ rule, negative }) => (
	<>
		<RuleLink {...rule} />
		<Value {...rule} unit="€" nilValueSymbol="—" negative={negative} />
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
					<Line negative rule={getRule('contrat salarié . salaire . net')} />
				</>
			) : null}
			<Line negative rule={getRule('impôt . neutre')} />
			<Line rule={getRule('contrat salarié . salaire . net après impôt')} />
		</div>
	)
}
