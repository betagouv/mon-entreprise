import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { MentionSousObjectif } from './MentionSousObjectif'

const DISPOSITIF = "salarié . dispositif d'exonération" as DottedName
const AVANTAGE = `${DISPOSITIF} . avantage` as DottedName

export const DispositifExoneration = () => {
	const engine = useEngine()
	const targetUnit = useSelector(targetUnitSelector)
	const dispositif = engine.evaluate(DISPOSITIF).nodeValue
	const avantage = engine.evaluate({
		valeur: AVANTAGE,
		unité: targetUnit,
	}).nodeValue

	if (
		typeof dispositif !== 'string' ||
		typeof avantage !== 'number' ||
		Math.round(avantage) === 0
	) {
		return null
	}

	return (
		<FromTop>
			<MentionSousObjectif>
				<RuleLink dottedName={AVANTAGE}>
					<Trans i18nKey="pages.simulateurs.salarié.dispositif-exoneration">
						Dispositif {{ dispositif }} : −{' '}
						<Value
							expression={AVANTAGE}
							displayedUnit="€"
							unit={targetUnit}
							precision={0}
							linkToRule={false}
						/>
					</Trans>
				</RuleLink>
			</MentionSousObjectif>
		</FromTop>
	)
}
