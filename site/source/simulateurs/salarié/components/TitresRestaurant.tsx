import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import { Emoji, SmallBody } from '@/design-system'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

export default function TitresRestaurant() {
	const { t } = useTranslation()
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName =
		'salarié . rémunération . frais professionnels . titres-restaurant . montant'

	return (
		<Condition expression={`${dottedName} > 0`}>
			<FromTop>
				<StyledInfo>
					<RuleLink dottedName={dottedName}>
						+{' '}
						<Value
							expression={dottedName}
							displayedUnit="€"
							unit={targetUnit}
							linkToRule={false}
						/>{' '}
						{t(
							'pages.simulateurs.salarié.titres-restaurant',
							'en titres-restaurant'
						)}{' '}
						<Emoji emoji=" 🍽" />
					</RuleLink>
				</StyledInfo>
			</FromTop>
		</Condition>
	)
}

const StyledInfo = styled(SmallBody)`
	position: relative;
	text-align: right;
	margin-top: -1.5rem;
	margin-bottom: 1.5rem;
	right: 0;
	z-index: 3;
`
