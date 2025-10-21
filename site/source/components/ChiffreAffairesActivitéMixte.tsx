import { pipe } from 'effect'
import * as A from 'effect/Array'
import * as E from 'effect/Either'
import * as O from 'effect/Option'
import * as R from 'effect/Record'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Switch } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import * as M from '@/domaine/Montant'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { UnitéMonétaireRécurrente } from '@/domaine/Unités'
import { useEngine } from '@/hooks/useEngine'
import { batchUpdateSituation } from '@/store/actions/actions'
import { targetUnitSelector } from '@/store/selectors/simulationSelectors'

import { ExplicableRule } from './conversation/Explicable'
import { Condition } from './EngineValue/Condition'
import { WhenApplicable } from './EngineValue/WhenApplicable'
import { SimulationGoal } from './Simulation'
import { FromTop } from './ui/animate'

const proportions = {
	'entreprise . activités . revenus mixtes . proportions . service BIC':
		"entreprise . chiffre d'affaires . service BIC",
	'entreprise . activités . revenus mixtes . proportions . service BNC':
		"entreprise . chiffre d'affaires . service BNC",
	'entreprise . activités . revenus mixtes . proportions . vente restauration hébergement':
		"entreprise . chiffre d'affaires . vente restauration hébergement",
} as const

const CAÀNone = pipe(
	proportions,
	R.toEntries,
	A.map(([règleProportion, règleCA]) => [règleCA, règleProportion] as const),
	R.fromEntries,
	R.map(() => O.none())
)

export default function ChiffreAffairesActivitéMixte({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const { t } = useTranslation()
	const adjustProportions = useAdjustProportions(dottedName)
	const dispatch = useDispatch()
	const clearChiffreAffaireMixte = useCallback(() => {
		dispatch(
			batchUpdateSituation(
				Object.values(proportions).reduce(
					(acc, chiffreAffaires) => ({ ...acc, [chiffreAffaires]: O.none() }),
					{} as Record<DottedName, O.Option<ValeurPublicodes>>
				)
			)
		)
	}, [dispatch])

	return (
		<fieldset>
			<legend className="sr-only">{t("Chiffre d'affaires")}</legend>
			<SimulationGoal
				appear={false}
				onUpdateSituation={clearChiffreAffaireMixte}
				dottedName={dottedName}
			/>
			<WhenApplicable dottedName="entreprise . activités . revenus mixtes">
				<FromTop>
					<ActivitéMixte />
					<ConditionWrapper>
						<Condition expression="entreprise . activités . revenus mixtes">
							{Object.values(proportions).map((chiffreAffaires) => (
								<SimulationGoal
									small
									key={chiffreAffaires}
									onUpdateSituation={adjustProportions}
									dottedName={chiffreAffaires}
								/>
							))}
						</Condition>
					</ConditionWrapper>
				</FromTop>
			</WhenApplicable>
		</fieldset>
	)
}

function useAdjustProportions(CADottedName: DottedName) {
	const engine = useEngine()
	const dispatch = useDispatch()
	const currentUnit = useSelector(targetUnitSelector)

	return useCallback(
		(name: DottedName, valeur?: ValeurPublicodes) => {
			const somme = (
				m: ReadonlyArray<M.Montant<UnitéMonétaireRécurrente>>
			): M.Montant<UnitéMonétaireRécurrente> =>
				currentUnit === '€/an'
					? M.sommeEnEurosParAn(m)
					: M.sommeEnEurosParMois(m)

			const nouvelleValeurPour = (
				règleCA: DottedName
			): O.Option<M.Montant<UnitéMonétaireRécurrente>> => {
				const nouvelleValeur =
					règleCA === name
						? pipe(
								(valeur as M.Montant | undefined) || M.eurosParAn(0),
								O.fromNullable
						  )
						: pipe(engine.evaluate(règleCA), PublicodesAdapter.decode)

				return nouvelleValeur as O.Option<M.Montant<UnitéMonétaireRécurrente>>
			}

			const nouveauCA = pipe(
				Object.values(proportions),
				A.map(nouvelleValeurPour),
				A.getSomes,
				somme
			)

			const nouvellesProportions = pipe(
				proportions,
				R.map((règleCA) =>
					pipe(
						règleCA,
						nouvelleValeurPour,
						O.map((CA) =>
							pipe(
								CA,
								M.parRapportÀ(nouveauCA),
								E.getOrElse(() => 0)
							)
						)
					)
				)
			)

			const situation = {
				[CADottedName]: O.some(nouveauCA),
				...CAÀNone,
				...nouvellesProportions,
			} as Record<DottedName, O.Option<ValeurPublicodes>>

			dispatch(batchUpdateSituation(situation))
		},
		[CADottedName, dispatch, currentUnit, engine]
	)
}

function ActivitéMixte() {
	const dispatch = useDispatch()
	const rule = useEngine().getRule('entreprise . activités . revenus mixtes')
	const defaultChecked =
		useEngine().evaluate('entreprise . activités . revenus mixtes')
			.nodeValue === true
	const onMixteChecked = useCallback(
		(checked: boolean) => {
			dispatch(
				batchUpdateSituation(
					Object.values(proportions).reduce(
						(acc, dottedName) => ({ ...acc, [dottedName]: O.none() }),
						{
							'entreprise . activités . revenus mixtes': O.some(
								checked ? 'oui' : 'non'
							),
						} as Record<DottedName, O.Option<ValeurPublicodes>>
					)
				)
			)
		},
		[dispatch]
	)

	return (
		<div key={Boolean(defaultChecked).toString()}>
			<StyledActivitéMixteContainer>
				<Trans>
					<Switch
						size="XS"
						defaultSelected={defaultChecked}
						onChange={onMixteChecked}
						light
						/* Need this useless aria-label to silence a React-Aria warning */
						aria-label=""
					>
						Activité mixte
					</Switch>
				</Trans>
				<ExplicableRule dottedName={rule.dottedName} light />
			</StyledActivitéMixteContainer>
		</div>
	)
}

const StyledActivitéMixteContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;

	@media (min-width: ${({ theme }) => theme.breakpointsWidth.sm}) {
		text-align: right;
		position: relative;
		z-index: 2;
	}
`
const ConditionWrapper = styled.div`
	margin-top: 0.75rem;
	& > div {
		height: auto !important;
		& > div > div > div > div {
			margin-top: 0.75rem;
		}
	}
	a {
		font-size: 1rem;
	}
`
