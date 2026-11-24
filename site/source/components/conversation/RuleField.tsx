import Engine from 'publicodes'
import { styled } from 'styled-components'

import { BoutonDeDocumentation } from '@/components/documentation/publicodes'
import { Fieldset, H3, H3Style } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'
import { DottedName } from '@/domaine/publicodes/DottedName'
import { useEngine } from '@/utils/publicodes/EngineContext'

import { normalizeRuleName } from '../utils/normalizeRuleName'
import RuleInput, {
	getRuleInputNature,
	OUI_NON_INPUT,
	PLUSIEURS_POSSIBILITES,
	UNE_POSSIBILITE,
} from './RuleInput'

/**
 * Indique si la question est rendue par un groupe de choix (boutons radio,
 * cases à cocher ou oui/non), qui doit alors être nommé par un `fieldset` et
 * sa `legend`.
 *
 * La nature du champ vient de `getRuleInputNature`, celle qu'utilise
 * `RuleInput` pour choisir le composant à afficher. `estUnMontant` et
 * `estUneQuantité` ne sont consultés qu'après les natures de choix, d'où
 * `false, false`.
 */
export function estUnGroupeDeChoix(
	dottedName: DottedName,
	engine: Engine<DottedName>
): boolean {
	const nature = getRuleInputNature(dottedName, engine, {}, false, false)

	return (
		nature === UNE_POSSIBILITE ||
		nature === PLUSIEURS_POSSIBILITES ||
		nature === OUI_NON_INPUT
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

	if (estUnGroupeDeChoix(dottedName, engine)) {
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
