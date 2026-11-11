import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import Value from '@/components/EngineValue/Value'
import RuleLink from '@/components/RuleLink'
import { FromTop } from '@/components/ui/animate'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { targetUnitSelector } from '@/store/selectors/simulation/targetUnit.selector'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { MentionSousObjectif } from './MentionSousObjectif'

const DISPOSITIF = "salarié . dispositif d'exonération" as DottedName
const MONTANT = `${DISPOSITIF} . montant` as DottedName
const TAUX_RÉDUITS = [
	'salarié . cotisations . allocations familiales . éligible taux réduit',
	'salarié . cotisations . maladie . employeur . éligible taux réduit',
] as DottedName[]

export const DispositifExoneration = () => {
	const { t } = useTranslation()
	const engine = useEngine()
	const targetUnit = useSelector(targetUnitSelector)
	const dispositif = engine.evaluate(DISPOSITIF).nodeValue
	const montant = engine.evaluate({
		valeur: MONTANT,
		unité: targetUnit,
	}).nodeValue

	if (
		typeof dispositif !== 'string' ||
		typeof montant !== 'number' ||
		Math.round(montant) === 0
	) {
		return null
	}

	const titre = engine.getRule(
		`${DISPOSITIF} . choix . ${dispositif}` as DottedName
	).title
	const avecTauxRéduits = TAUX_RÉDUITS.some(
		(règle) => engine.evaluate(règle).nodeValue === true
	)

	return (
		<FromTop>
			<MentionSousObjectif>
				<RuleLink dottedName={MONTANT}>
					<Trans i18nKey="pages.simulateurs.salarié.dispositif-exoneration">
						{{ titre }} : −{' '}
						<Value
							expression={MONTANT}
							displayedUnit="€"
							unit={targetUnit}
							precision={0}
							linkToRule={false}
						/>
					</Trans>
					{avecTauxRéduits &&
						` ${t(
							'pages.simulateurs.salarié.dispositif-exoneration-taux-reduits',
							'+ taux réduits'
						)}`}
				</RuleLink>
			</MentionSousObjectif>
		</FromTop>
	)
}
