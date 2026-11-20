import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'

import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { MentionSousObjectif } from '@/components/Simulation'
import { FromTop } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

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
					<Trans
						i18nKey="pages.simulateurs.salarié.dispositif-exoneration"
						defaults={
							'Dont dispositif {{dispositif}}\u00a0: −\u00a0<montant></montant>'
						}
						values={{
							dispositif: engine.getRule(
								`${DISPOSITIF} . ${dispositif}` as DottedName
							).title,
						}}
						components={{
							montant: (
								<Value
									expression={AVANTAGE}
									displayedUnit="€"
									unit={targetUnit}
									precision={0}
									linkToRule={false}
								/>
							),
						}}
					/>
				</RuleLink>
			</MentionSousObjectif>
		</FromTop>
	)
}
