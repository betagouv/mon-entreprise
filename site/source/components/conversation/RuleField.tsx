import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import { RuleNode, Unit } from 'publicodes'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { useEngine } from '@/components/utils/EngineContext'
import { H3 } from '@/design-system'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant } from '@/domaine/Montant'
import { isQuantité } from '@/domaine/Quantité'
import { isUnitéMonétaire, isUnitéQuantité } from '@/domaine/Unités'

import RuleInput from './RuleInput'

const AMOUNT_FIELD = '<AmountField />'
const QUANTITY_FIELD = '<QuantityField />'
const RADIO_GROUP = '<RadioGroup />'
const SELECT_ATMP = '<SelectAtmp />'
const SELECT_COMMUNE = '<SelectCommune />'
const YES_OR_NO_TOGGLE_GROUP = '<YesOrNoToggleGroup />'

function getRuleFieldNature(
	rule: RuleNode,
	evaluationUnit: Unit | undefined,
	evaluationType: string | null | undefined,
	value: ValeurPublicodes | undefined
): string {
	if (rule.possibilities?.nodeKind === 'une possibilité') return RADIO_GROUP

	if (rule.dottedName === 'établissement . taux ATMP . taux collectif')
		return SELECT_ATMP

	if (rule.rawNode.API === 'commune') return SELECT_COMMUNE

	if (
		evaluationUnit == null &&
		['booléen', 'notification', undefined].includes(
			rule.rawNode.type as string
		) &&
		evaluationType !== 'number'
	)
		return YES_OR_NO_TOGGLE_GROUP

	const unitéPublicodes = rule.rawNode.unité

	if ((value && isMontant(value)) || isUnitéMonétaire(unitéPublicodes))
		return AMOUNT_FIELD

	if ((value && isQuantité(value)) || isUnitéQuantité(unitéPublicodes))
		return QUANTITY_FIELD

	return 'Nature non déterminée'
}

type RuleFieldProps = {
	dottedName: DottedName
	labelOrLegend: string | undefined
	onChange: (
		value: ValeurPublicodes | undefined,
		dottedName: DottedName
	) => void
	onSubmit?: (source?: string) => void
}

/**
 * <RuleField /> est un "composant Factory".
 *
 * Il analyse une règle Publicodes pour déterminer le type de champ(s) à afficher
 * en fonction du type de règle et des métadonnées associées.
 *
 * Il a vocation à remplacer <RuleInput /> qui n'embarque pas le label ou la legend,
 * compliquant la mise en place de l'accessibilité de ces champs.
 */
export function RuleField({
	dottedName,
	labelOrLegend,
	onChange,
	onSubmit,
}: RuleFieldProps) {
	const engine = useEngine()

	const rule = engine.getRule(dottedName)

	const evaluation = engine.evaluate(dottedName)
	const evaluationUnit = evaluation?.unit
	const evaluationType = evaluation?.nodeValue as string | null
	const decodedEvaluation: O.Option<ValeurPublicodes> =
		PublicodesAdapter.decode(evaluation)

	const value = O.getOrUndefined(decodedEvaluation)

	const ruleFieldNature = getRuleFieldNature(
		rule,
		evaluationUnit,
		evaluationType,
		value
	)

	const htmlForId = dottedName.replaceAll(' . ', '_').replaceAll(' ', '-')

	if ([RADIO_GROUP, YES_OR_NO_TOGGLE_GROUP].includes(ruleFieldNature)) {
		return (
			<fieldset>
				<H3 as="legend">
					{labelOrLegend}

					<ExplicableRule light dottedName={dottedName} />
				</H3>

				<RuleInput
					dottedName={dottedName}
					onChange={onChange}
					onSubmit={onSubmit}
				/>
			</fieldset>
		)
	}

	return (
		<>
			<H3 as="label" htmlFor={htmlForId}>
				{labelOrLegend}

				<ExplicableRule light dottedName={dottedName} />
			</H3>

			<RuleInput
				id={htmlForId}
				dottedName={dottedName}
				onChange={onChange}
				onSubmit={onSubmit}
			/>
		</>
	)
}
