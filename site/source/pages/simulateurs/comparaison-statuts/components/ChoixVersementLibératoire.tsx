import { Option } from 'effect'
import { Key, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import RuleLink from '@/components/RuleLink'
import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { SmallBody, Strong } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { OuiNon } from '@/domaine/OuiNon'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

const DOTTED_NAME =
	'dirigeant . auto-entrepreneur . impôt . versement libératoire'

export const ChoixVersementLibératoire = () => {
	const dispatch = useDispatch()
	const engine = useEngine()
	const { t } = useTranslation()

	const value = PublicodesAdapter.decode(
		engine.evaluate({
			valeur: DOTTED_NAME,
			contexte: { 'dirigeant . auto-entrepreneur': 'oui' },
		})
	)

	const handleChange = useCallback(
		(value: Key) => {
			dispatch(
				ajusteLaSituation({
					[DOTTED_NAME]: value as OuiNon,
				} as Record<DottedName, ValeurPublicodes>)
			)
		},
		[dispatch]
	)

	return (
		<SimulationGoalRadio
			titre={
				<RuleLink
					dottedName={DOTTEDNAME_AUTOENTREPRENEUR_VERSEMENT_LIBERATOIRE}
				>
					{t(
						'pages.simulateurs.comparaison-statuts.montants.versement-libératoire.titre',
						'Versement libératoire (pour auto-entreprise)'
					)}
				</RuleLink>
			}
			aide={<VersementLibératoirePopoverContent />}
			value={Option.isSome(value) ? (value.value as OuiNon) : undefined}
			options={[
				{
					key: 'oui',
					value: 'oui',
					label: t('global.oui', 'Oui'),
				},
				{
					key: 'non',
					value: 'non',
					label: t('global.non', 'Non'),
				},
			]}
			onChange={handleChange}
		/>
	)
}

const VersementLibératoirePopoverContent = () => (
	<SmallBodyWithoutMargin>
		<Trans i18nKey="pages.simulateurs.comparaison-statuts.montants.versement-libératoire.info-bulle">
			En tant qu’auto-entreprise, c’est l’
			<Strong>impôt sur le revenu</Strong> qui est appliqué automatiquement.
			Dans certaines situations, vous pouvez opter pour le{' '}
			<Strong>versement libératoire</Strong>.
		</Trans>
	</SmallBodyWithoutMargin>
)

const SmallBodyWithoutMargin = styled(SmallBody)`
	margin: 0;
`
