import { Condition } from '@/components/EngineValue/Condition'
import { ValueProps } from '@/components/EngineValue/types'
import Value from '@/components/EngineValue/Value'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'

type LineProps = {
	rule: DottedName
	negative?: boolean
	title?: string
} & Pick<ValueProps<DottedName>, 'displayedUnit' | 'precision'>

export default function Line({
	rule,
	negative = false,
	title,
	displayedUnit = '€',
	precision,
}: LineProps) {
	return (
		<WhenApplicable dottedName={rule}>
			<WhenAlreadyDefined dottedName={rule}>
				<Condition expression={`${rule} > 0`}>
					<li className="payslip__salaryLine">
						<RuleLink dottedName={rule}>{title}</RuleLink>
						<Value
							linkToRule={false}
							expression={(negative ? '- ' : '') + rule}
							unit={displayedUnit === '€' ? '€/mois' : displayedUnit}
							displayedUnit={displayedUnit}
							precision={precision}
						/>
					</li>
				</Condition>
			</WhenAlreadyDefined>
		</WhenApplicable>
	)
}
