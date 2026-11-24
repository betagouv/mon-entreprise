import { RuleNode, Unit } from 'publicodes'
import { styled } from 'styled-components'

import { BoutonDeDocumentation } from '@/components/documentation/publicodes'
import { Fieldset, H3, H3Style } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { normalizeRuleName } from '../utils/normalizeRuleName'
import RuleInput from './RuleInput'

/**
 * Indique si la question est rendue par un groupe de choix (boutons radio ou
 * oui/non), qui doit alors être nommé par un `fieldset` et sa `legend`.
 */
export function estUnGroupeDeChoix(
	rule: RuleNode,
	evaluationUnit: Unit | undefined,
	evaluationType: string | null | undefined
): boolean {
	if (rule.possibilities?.nodeKind === 'une possibilité') return true

	if (rule.dottedName === 'établissement . taux ATMP . taux collectif')
		return false

	if (rule.rawNode.API === 'commune') return false

	return (
		evaluationUnit == null &&
		['booléen', 'notification', undefined].includes(
			rule.rawNode.type as string
		) &&
		evaluationType !== 'number'
	)
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

	if (estUnGroupeDeChoix(rule, evaluationUnit, evaluationType)) {
		return (
			<Fieldset>
				<StyledLegend>
					{labelOrLegend}

					<BoutonDeDocumentation dottedName={dottedName} />
				</StyledLegend>

				<RuleInput
					dottedName={dottedName}
					onChange={onChange}
					onSubmit={onSubmit}
				/>
			</Fieldset>
		)
	}

	const htmlForId = normalizeRuleName.Input(dottedName)

	return (
		<>
			<LabelWithMargin as="label" htmlFor={htmlForId}>
				{labelOrLegend}

				<BoutonDeDocumentation dottedName={dottedName} />
			</LabelWithMargin>

			<RuleInput
				id={htmlForId}
				dottedName={dottedName}
				onChange={onChange}
				onSubmit={onSubmit}
			/>
		</>
	)
}

const StyledLegend = styled.legend`
	${H3Style}

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xxs}`};
`

const LabelWithMargin = styled(H3)`
	display: inline-block;

	margin: ${({ theme }) => `${theme.spacings.lg} 0 ${theme.spacings.xs}`};
`
