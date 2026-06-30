import { Option } from 'effect'
import { Key, useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import RuleLink from '@/components/RuleLink'
import { SimulationGoalRadio } from '@/components/Simulation/SimulationGoalRadio'
import { Message, SmallBody, Strong } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { ajusteLaSituation } from '@/store/actions/actions'
import { useEngine } from '@/utils/publicodes/EngineContext'

const DOTTED_NAME = 'entreprise . imposition'

type IRouIS = "'IR'" | "'IS'"

export const ChoixImposition = () => {
	const dispatch = useDispatch()
	const engine = useEngine()
	const { t } = useTranslation()

	const value = PublicodesAdapter.decode(engine.evaluate(DOTTED_NAME))

	const handleChange = useCallback(
		(value: Key) => {
			dispatch(
				ajusteLaSituation({
					[DOTTED_NAME]: value as IRouIS,
				} as Record<DottedName, ValeurPublicodes>)
			)
		},
		[dispatch]
	)

	return (
		<SimulationGoalRadio
			titre={
				<RuleLink dottedName={DOTTEDNAME_ENTREPRISE_IMPOSITION}>
					{t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.titre',
						'Mode d’imposition (hors auto-entreprise)'
					)}
				</RuleLink>
			}
			aide={<ImpositionPopoverContent />}
			value={Option.isSome(value) ? (value.value as string) : undefined}
			options={[
				{
					key: 'IR',
					value: 'IR',
					label: t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.IR',
						'Impôt sur le revenu'
					),
				},
				{
					key: 'IS',
					value: 'IS',
					label: t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.IS',
						'Impôt sur les sociétés'
					),
				},
			]}
			onChange={handleChange}
		/>
	)
}

const ImpositionPopoverContent = () => {
	const { t } = useTranslation()

	return (
		<div>
			<SmallBodyWithoutTopMargin>
				<Trans i18nKey="pages.simulateurs.comparaison-statuts.montants.imposition.info-bulle">
					Vous pouvez{' '}
					<Strong>
						choisir entre l’imposition sur les sociétés et sur le revenu
					</Strong>{' '}
					durant les 5 premières années.
				</Trans>
			</SmallBodyWithoutTopMargin>

			<StyledMessage type="info" icon mini>
				<SmallBodyWithoutMargin>
					{t(
						'pages.simulateurs.comparaison-statuts.montants.imposition.disclaimer',
						'À ce jour, ce comparateur ne prend pas en compte le calcul de l’impôt sur le revenu pour les SAS(U).'
					)}
				</SmallBodyWithoutMargin>
			</StyledMessage>
		</div>
	)
}

const StyledMessage = styled(Message)`
	margin: 0;
	padding: ${({ theme }) => theme.spacings.sm};
`

const SmallBodyWithoutTopMargin = styled(SmallBody)`
	margin-top: 0;
	margin-bottom: ${({ theme }) => theme.spacings.xs};
`

const SmallBodyWithoutMargin = styled(SmallBody)`
	margin: 0;
`
