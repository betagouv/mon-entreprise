import { T } from 'Components'
import Value from 'Components/Value'
import React from 'react'
import RuleLink from './RuleLink'

export let SalaireBrutSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
			'contrat salarié . rémunération . avantages en nature'
		),
		indemnitésSalarié = getRule('contrat salarié . indemnités salarié'),
		heuresSupplémentaires = getRule(
			'contrat salarié . rémunération . heures supplémentaires'
		),
		salaireDeBase = getRule('contrat salarié . rémunération . brut de base'),
		rémunérationBrute = getRule('contrat salarié . rémunération . brut'),
		primes = getRule('contrat salarié . rémunération . primes')
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire</T>
			</h4>
			<Line rule={salaireDeBase} />
			{!!avantagesEnNature?.nodeValue && (
				<Line
					rule={getRule(
						'contrat salarié . rémunération . avantages en nature . montant'
					)}
				/>
			)}
			{!!indemnitésSalarié?.nodeValue && <Line rule={indemnitésSalarié} />}
			{!!heuresSupplémentaires?.nodeValue && (
				<Line rule={heuresSupplémentaires} />
			)}
			{!!primes?.nodeValue && <Line rule={primes} />}
			{rémunérationBrute.nodeValue !== salaireDeBase.nodeValue && (
				<Line rule={rémunérationBrute} />
			)}
		</div>
	)
}

export let Line = ({ rule, ...props }) => (
	<>
		<RuleLink {...rule} />
		<Value {...rule} nilValueSymbol="—" unit="€" {...props} />
	</>
)

export let SalaireNetSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
		'contrat salarié . rémunération . avantages en nature'
	)
	let impôt = getRule('impôt')
	let netImposable = getRule('contrat salarié . rémunération . net imposable')
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<T>Salaire net</T>
			</h4>
			{netImposable && <Line rule={netImposable} />}
			{avantagesEnNature.nodeValue && (
				<>
					{/* Salaire net de cotisations */}
					<Line
						rule={getRule(
							'contrat salarié . rémunération . net de cotisations'
						)}
					/>
					{/* Avantages en nature */}
					<Line
						negative
						rule={getRule(
							'contrat salarié . rémunération . avantages en nature . montant'
						)}
					/>
				</>
			)}
			<Line rule={getRule('contrat salarié . rémunération . net')} />
			{impôt && (
				<>
					<Line negative rule={impôt} />
					<Line
						rule={getRule('contrat salarié . rémunération . net après impôt')}
					/>
				</>
			)}
		</div>
	)
}
