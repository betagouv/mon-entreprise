import { DottedName } from 'modele-social'
import { styled } from 'styled-components'

import { useEngine } from '@/components/utils/EngineContext'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'

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
	const engineValue = useEngine()
	const rule = engineValue.getRule(dottedName)

	const labelOrLegend = rule.rawNode.question || 'Missing label or legend'

	return <WorkInProgressContainer>{labelOrLegend}</WorkInProgressContainer>
}

const WorkInProgressContainer = styled.div`
	margin: 1rem -1rem;
	padding: 1rem;
	border: 1px dotted grey;

	background: #f8f8f8;
`
