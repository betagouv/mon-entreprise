import Value, { Condition, ValueProps } from 'Components/EngineValue'
import RuleLink from 'Components/RuleLink'
import { Trans } from 'react-i18next'
import { DottedName } from 'Rules'

export const SalaireBrutSection = () => {
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire</Trans>
			</h4>
			<Line rule="contrat salarié . rémunération . brut de base" />
			<Line rule="contrat salarié . rémunération . avantages en nature . montant" />
			<Line rule="contrat salarié . activité partielle . retrait absence" />
			<Line rule="contrat salarié . activité partielle . indemnités" />
			<Line rule="contrat salarié . rémunération . heures supplémentaires" />
			<Line rule="contrat salarié . rémunération . heures complémentaires" />
			<Line rule="contrat salarié . rémunération . primes" />
			<Line rule="contrat salarié . frais professionnels" />
			<Line rule="contrat salarié . CDD . indemnités salarié" />
			<Condition expression="contrat salarié . rémunération . brut de base != contrat salarié . rémunération . brut">
				<Line rule="contrat salarié . rémunération . brut" />
			</Condition>
		</div>
	)
}

export const SalaireNetSection = () => {
	return (
		<div className="payslip__salarySection">
			<h4 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</h4>
			<Line rule="contrat salarié . rémunération . net imposable" />
			<Condition
				expression={[
					'contrat salarié . rémunération . avantages en nature',
					'contrat salarié . frais professionnels . titres-restaurant'
				]}
			>
				<Line rule="contrat salarié . rémunération . net de cotisations" />
			</Condition>
			<Line
				negative
				rule="contrat salarié . rémunération . avantages en nature . montant"
			/>
			<Line
				negative
				rule="contrat salarié . frais professionnels . titres-restaurant . montant"
			/>
			<Line
				rule="contrat salarié . rémunération . net"
				className="payslip__total"
			/>
			<Condition expression="impôt">
				<Line negative rule="impôt" unit="€/mois" />
				<Line
					className="payslip__total"
					rule="contrat salarié . rémunération . net après impôt"
				/>
			</Condition>
		</div>
	)
}

type LineProps = {
	rule: DottedName
	negative?: boolean
} & Omit<ValueProps, 'expression'>

export function Line({
	rule,
	displayedUnit = '€',
	negative = false,
	className,
	...props
}: LineProps) {
	return (
		<Condition expression={rule}>
			<RuleLink dottedName={rule} className={className} />
			<Value
				linkToRule={false}
				expression={(negative ? '- ' : '') + rule}
				displayedUnit={displayedUnit}
				className={className}
				{...props}
			/>
		</Condition>
	)
}
