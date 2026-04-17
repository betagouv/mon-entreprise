import { RègleModèleAssimiléSalarié } from 'modele-as'
import { RègleModèleSocial } from 'modele-social'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import { ValueProps } from '@/components/EngineValue/types'
import Value from '@/components/EngineValue/Value'
import { WhenAlreadyDefined } from '@/components/EngineValue/WhenAlreadyDefined'
import { WhenApplicable } from '@/components/EngineValue/WhenApplicable'
import RuleLink from '@/components/RuleLink'
import { DottedName } from '@/domaine/publicodes/DottedName'

type LineProps = {
	rule: RègleModèleSocial | RègleModèleAssimiléSalarié
	negative?: boolean
	title?: string
} & Pick<ValueProps<DottedName>, 'displayedUnit' | 'precision'>

export const Line = ({
	rule,
	negative = false,
	title,
	displayedUnit = '€',
	precision,
}: LineProps) => (
	<WhenApplicable dottedName={rule}>
		<WhenAlreadyDefined dottedName={rule}>
			<Condition expression={`${rule} > 0`}>
				<Li>
					<RuleLink dottedName={rule}>{title}</RuleLink>
					<Value
						linkToRule={false}
						expression={(negative ? '- ' : '') + rule}
						unit={displayedUnit === '€' ? '€/mois' : displayedUnit}
						displayedUnit={displayedUnit}
						precision={precision}
					/>
				</Li>
			</Condition>
		</WhenAlreadyDefined>
	</WhenApplicable>
)

const Li = styled.li`
	display: flex;
	justify-content: space-between;

	&:nth-of-type(2n) {
		background-color: ${({ theme }) =>
			theme.darkMode
				? theme.colors.extended.dark[600]
				: theme.colors.bases.primary[200]};
	}
`
