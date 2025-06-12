import { pipe } from 'effect'
import * as E from 'effect/Either'
import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import { serializeEvaluation } from 'publicodes'
import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { styled } from 'styled-components'

import { Switch } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { diviséPar, eurosParAn, Montant } from '@/domaine/Montant'
import { batchUpdateSituation } from '@/store/actions/actions'

import { ExplicableRule } from './conversation/Explicable'
import { Condition } from './EngineValue/Condition'
import { WhenApplicable } from './EngineValue/WhenApplicable'
import { SimulationGoal } from './Simulation'
import { FromTop } from './ui/animate'
import { useEngine } from './utils/EngineContext'

const proportions = {
	'entreprise . activités . revenus mixtes . proportions . service BIC':
		"entreprise . chiffre d'affaires . service BIC",
	'entreprise . activités . revenus mixtes . proportions . service BNC':
		"entreprise . chiffre d'affaires . service BNC",
	'entreprise . activités . revenus mixtes . proportions . vente restauration hébergement':
		"entreprise . chiffre d'affaires . vente restauration hébergement",
} as const

export default function ChiffreAffairesActivitéMixte({
	dottedName,
}: {
	dottedName: DottedName
}) {
	const adjustProportions = useAdjustProportions(dottedName)
	const dispatch = useDispatch()
	const { t } = useTranslation()
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
				</FromTop>
			</WhenApplicable>
		</fieldset>
	)
}

function useAdjustProportions(CADottedName: DottedName) {
	const engine = useEngine()
	const dispatch = useDispatch()

	return useCallback(
		(name: DottedName, valeur?: ValeurPublicodes) => {
			const value = valeur && PublicodesAdapter.encode(O.some(valeur), name)

			const checkValue = (
				val: unknown
			): val is { valeur: number; unité: string } =>
				val != null &&
				typeof val === 'object' &&
				'valeur' in val &&
				'unité' in val &&
				typeof val.valeur === 'number' &&
				typeof val.unité === 'string'

			const old = Object.values(proportions).map((chiffreAffaire) =>
				serializeEvaluation(
					engine.evaluate(
						name === chiffreAffaire && checkValue(value)
							? value
							: chiffreAffaire
					)
				)
			)
			const nouveauCA = pipe(
				engine.evaluate({ somme: old.filter(Boolean) }),
				PublicodesAdapter.decode
			)

			const situation = Object.entries(proportions).reduce(
				(acc, [proportionName, valueName]) => {
					const newValue = pipe(
						engine.evaluate(
							valueName === name && checkValue(value)
								? value
								: { valeur: valueName, 'par défaut': '0€/an' }
						),
						PublicodesAdapter.decode
					)

					const nouvelleProportion = pipe(
						newValue as O.Option<Montant<'EuroParAn'>>,
						O.getOrElse(() => eurosParAn(0)),
						diviséPar(
							pipe(
								nouveauCA as O.Option<Montant<'EuroParAn'>>,
								O.getOrElse(() => eurosParAn(0))
							).valeur
						),
						E.getOrElse(() => eurosParAn(0))
					)

					return {
						...acc,
						[proportionName]: nouvelleProportion.valeur,
						[valueName]: undefined,
					}
				},
				{ [CADottedName]: nouveauCA } as Record<
					DottedName,
					O.Option<ValeurPublicodes>
				>
			)
			dispatch(batchUpdateSituation(situation))
		},
		[CADottedName, engine, dispatch]
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
		margin-top: -1.5rem;
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
	}
`
