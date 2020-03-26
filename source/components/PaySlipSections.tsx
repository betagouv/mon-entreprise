import Value from 'Components/Value'
import React from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { defaultUnitSelector } from 'Selectors/analyseSelectors'
import { DottedName, EvaluatedRule } from 'Types/rule'
import RuleLink from './RuleLink'

export let SalaireBrutSection = ({
	getRule
}: {
	getRule: (rule: DottedName) => EvaluatedRule
}) => {
	let avantagesEnNature = getRule(
			'contrat salarié . rémunération . avantages en nature'
		),
		indemnitésSalarié = getRule('contrat salarié . CDD . indemnités salarié'),
		remboursementDeFrais = getRule('contrat salarié . frais professionnels'),
		heuresSupplémentaires = getRule(
			'contrat salarié . rémunération . heures supplémentaires'
		),
		salaireDeBase = getRule('contrat salarié . rémunération . brut de base'),
		rémunérationBrute = getRule('contrat salarié . rémunération . brut'),
		chômagePartielIndemnité = getRule(
			'contrat salarié . activité partielle . indemnités'
		),
		chômagePartielAbsence = getRule(
			'contrat salarié . activité partielle . retrait absence'
		),
		primes = getRule('contrat salarié . rémunération . primes')
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire</Trans>
			</h4>
			<Line rule={salaireDeBase} />
			{!!avantagesEnNature?.nodeValue && (
				<Line
					rule={getRule(
						'contrat salarié . rémunération . avantages en nature . montant'
					)}
				/>
			)}
			{chômagePartielIndemnité?.nodeValue && (
				<>
					<Line rule={chômagePartielAbsence} />
					<Line rule={chômagePartielIndemnité} />
				</>
			)}
			{!!heuresSupplémentaires?.nodeValue && (
				<Line rule={heuresSupplémentaires} />
			)}
			{!!primes?.nodeValue && <Line rule={primes} />}
			{!!remboursementDeFrais?.nodeValue && (
				<Line rule={remboursementDeFrais} />
			)}
			{!!indemnitésSalarié?.nodeValue && <Line rule={indemnitésSalarié} />}
			{rémunérationBrute.nodeValue !== salaireDeBase.nodeValue && (
				<Line rule={rémunérationBrute} />
			)}
		</div>
	)
}

export let Line = ({ rule, ...props }) => {
	const defaultUnit = useSelector(defaultUnitSelector)
	return (
		<>
			<RuleLink {...rule} />
			<Value
				{...rule}
				nilValueSymbol="—"
				defaultUnit={defaultUnit}
				{...props}
			/>
		</>
	)
}

export let SalaireNetSection = ({ getRule }) => {
	let avantagesEnNature = getRule(
		'contrat salarié . rémunération . avantages en nature . montant'
	)
	let impôt = getRule('impôt')
	let netImposable = getRule('contrat salarié . rémunération . net imposable')
	const retenueTitresRestaurant = getRule(
		'contrat salarié . frais professionnels . titres-restaurant . montant'
	)
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</h4>
			{netImposable && <Line rule={netImposable} />}
			{(avantagesEnNature?.nodeValue || retenueTitresRestaurant?.nodeValue) && (
				<Line
					rule={getRule('contrat salarié . rémunération . net de cotisations')}
				/>
			)}
			{!!avantagesEnNature?.nodeValue && (
				<Line negative rule={avantagesEnNature} />
			)}
			{!!retenueTitresRestaurant?.nodeValue && (
				<Line negative rule={retenueTitresRestaurant} />
			)}

			<Line rule={getRule('contrat salarié . rémunération . net')} />
			{!!impôt && (
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
