import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Condition } from '@/components/EngineValue/Condition'
import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { MentionSousObjectif } from '@/components/Simulation'
import { FromTop } from '@/components/ui/animate'
import { Emoji } from '@/design-system'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'

export default function TitresRestaurant() {
	const { t } = useTranslation()
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName =
		'salarié . rémunération . frais professionnels . titres-restaurant . montant'

	return (
		<Condition expression={`${dottedName} > 0`}>
			<FromTop>
				<MentionSousObjectif>
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
				</MentionSousObjectif>
			</FromTop>
		</Condition>
	)
}
