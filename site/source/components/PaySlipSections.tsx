import Value, {
	Condition,
	ValueProps,
	WhenAlreadyDefined,
	WhenApplicable,
} from '@/components/EngineValue'
import RuleLink from '@/components/RuleLink'
import { H4 } from '@/design-system/typography/heading'
import { DottedName } from 'modele-social'
import { Trans, useTranslation } from 'react-i18next'

export const SalaireBrutSection = () => {
	return (
		<div className="payslip__salarySection">
			<H4 className="payslip__salaryTitle">
				<Trans>Salaire</Trans>
			</H4>
			<Line rule="salarié . contrat . salaire brut" />
			<Line rule="salarié . rémunération . avantages en nature . montant" />
			<Line rule="salarié . activité partielle . retrait absence" />
			<Line rule="salarié . activité partielle . indemnités" />
			<Line rule="salarié . rémunération . heures supplémentaires" />
			<Line rule="salarié . rémunération . heures complémentaires" />
			<Line rule="salarié . rémunération . primes" />
			<Line rule="salarié . rémunération . frais professionnels" />
			<Line rule="salarié . rémunération . indemnités CDD" />
			<Condition expression="salarié . contrat . salaire brut != salarié . rémunération . brut">
				<Line rule="salarié . rémunération . brut" />
			</Condition>
		</div>
	)
}

export const SalaireNetSection = () => {
	const { t } = useTranslation()

	return (
		<div className="payslip__salarySection">
			<H4 className="payslip__salaryTitle">
				<Trans>Salaire net</Trans>
			</H4>
			<Line rule="salarié . rémunération . net . imposable" />
			<Condition
				expression={{
					'toutes ces conditions': [
						'salarié . rémunération . avantages en nature', // bool
						'salarié . rémunération . frais professionnels . titres-restaurant', // bool
					],
				}}
			>
				<Line rule="salarié . rémunération . net . à payer avant impôt" />
			</Condition>
			<Line
				negative
				rule="salarié . rémunération . avantages en nature . montant"
			/>
			<Line
				negative
				rule="salarié . rémunération . frais professionnels . titres-restaurant . montant"
			/>
			<Line rule="salarié . rémunération . net . à payer avant impôt" />
			<Condition expression="impôt . montant > 0">
				<Line
					negative
					rule="impôt . montant"
					title={t('impôt sur le revenu')}
					unit="€/mois"
				/>
				<Line rule="salarié . rémunération . net . payé après impôt" />
			</Condition>
		</div>
	)
}

type LineProps = {
	rule: DottedName
	title?: string
	negative?: boolean
} & Omit<ValueProps<DottedName>, 'expression'>

export function Line({
	rule,
	displayedUnit = '€',
	negative = false,
	title,
	...props
}: LineProps) {
	return (
		<WhenApplicable dottedName={rule}>
			<WhenAlreadyDefined dottedName={rule}>
				<Condition expression={`${rule} > 0`}>
					<RuleLink dottedName={rule}>{title}</RuleLink>
					<Value
						linkToRule={false}
						expression={(negative ? '- ' : '') + rule}
						unit={displayedUnit === '€' ? '€/mois' : displayedUnit}
						displayedUnit={displayedUnit}
						{...props}
					/>
				</Condition>
			</WhenAlreadyDefined>
		</WhenApplicable>
	)
}
