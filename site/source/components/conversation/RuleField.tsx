import * as O from 'effect/Option'
import { DottedName } from 'modele-social'
import { RuleNode } from 'publicodes'
import { styled } from 'styled-components'

import { ExplicableRule } from '@/components/conversation/Explicable'
import { useEngine } from '@/components/utils/EngineContext'
import {
	PublicodesAdapter,
	ValeurPublicodes,
} from '@/domaine/engine/PublicodesAdapter'
import { isMontant } from '@/domaine/Montant'
import { isQuantité } from '@/domaine/Quantité'
import { isUnitéMonétaire, isUnitéQuantité } from '@/domaine/Unités'

const AMOUNT_FIELD = '<AmountField />'
const QUANTITY_FIELD = '<QuantityField />'
const RADIO_GROUP = '<RadioGroup />'
const SELECT_COMMUNE = '<SelectCommune />'
const YES_OR_NO_TOGGLE_GROUP = '<YesOrNoToggleGroup />'

function getRuleFieldNature(
	rule: RuleNode,
	value: ValeurPublicodes | undefined
): string {
	const unitéPublicodes = rule.rawNode.unité

	if ((value && isMontant(value)) || isUnitéMonétaire(unitéPublicodes))
		return AMOUNT_FIELD

	if ((value && isQuantité(value)) || isUnitéQuantité(unitéPublicodes))
		return QUANTITY_FIELD

	if (rule.possibilities?.nodeKind === 'une possibilité') return RADIO_GROUP

	if (rule.rawNode.API === 'commune') return SELECT_COMMUNE

	if (['oui', 'non'].includes(rule.rawNode['par défaut'] as string))
		return YES_OR_NO_TOGGLE_GROUP

	return 'Nature non déterminée'
}

type RuleFieldProps = {
	dottedName: DottedName
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
export function RuleField({ dottedName, onChange, onSubmit }: RuleFieldProps) {
	const engine = useEngine()

	const rule = engine.getRule(dottedName)

	const evaluation = engine.evaluate(dottedName)
	const decodedEvaluation: O.Option<ValeurPublicodes> =
		PublicodesAdapter.decode(evaluation)

	console.log('rule', rule)
	console.log('evaluation', evaluation)
	console.log('decodedEvaluation', decodedEvaluation)

	const value = O.getOrUndefined(decodedEvaluation)

	console.log('value', value)

	const labelOrLegend =
		rule.rawNode.question || 'ERROR: Missing label or legend'

	const ruleFieldNature = getRuleFieldNature(rule, value)

	return (
		<WorkInProgressContainer>
			<div>
				{labelOrLegend}

				<ExplicableRule light dottedName={dottedName} />
			</div>

			<div>
				Type de champ(s) à afficher : <i>{ruleFieldNature}</i>
			</div>
		</WorkInProgressContainer>
	)
}

const WorkInProgressContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;

	margin: 1rem -1rem;
	padding: 1rem;
	border: 1px dotted grey;

	background: #f8f8f8;
`
