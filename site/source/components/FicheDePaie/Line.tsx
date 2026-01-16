import { ValueProps } from '@/components/EngineValue/types'
import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'

import { Condition } from '../EngineValue/Condition'
import Value from '../EngineValue/Value'
import { WhenAlreadyDefined } from '../EngineValue/WhenAlreadyDefined'
import { WhenApplicable } from '../EngineValue/WhenApplicable'

type LineProps = {
	rule: DottedName
	title?: string
	negative?: boolean
} & Omit<ValueProps<DottedName>, 'expression'>

export default function Line({
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
					<li className="payslip__salaryLine">
						<RuleLink dottedName={rule}>{title}</RuleLink>
						<Value
							linkToRule={false}
							expression={(negative ? '- ' : '') + rule}
							unit={displayedUnit === '€' ? '€/mois' : displayedUnit}
							displayedUnit={displayedUnit}
							{...props}
						/>
					</li>
				</Condition>
			</WhenAlreadyDefined>
		</WhenApplicable>
	)
}
