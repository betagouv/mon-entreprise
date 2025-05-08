import { DottedName } from 'modele-social'
import Engine, { ASTNode, RuleNode } from 'publicodes'
import { useCallback } from 'react'

import { ChoixMultiple, ChoixOption } from '@/design-system/field/choix'
import { ValeurPublicodes } from '@/domaine/engine/RèglePublicodeAdapter'

interface PlusieursPossibilitésProps {
	choices: Array<RuleNode<DottedName>>
	engine: Engine<DottedName>
	onChange?: (value: ValeurPublicodes, name: DottedName) => void
	value?: ValeurPublicodes
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean
	onSubmit?: (source?: string) => void
	suggestions?: Record<string, ASTNode>

	aria?: {
		labelledby?: string
		label?: string
	}
}

export function PlusieursPossibilités({
	choices,
	onChange,
	engine,
	aria = {},
	id,
}: PlusieursPossibilitésProps) {
	const options: ChoixOption[] = choices
		.map((node) => {
			const evaluation = engine.evaluate(node)

			return {
				id: node.dottedName as string,
				value: evaluation.nodeValue === true,
				label: node.title,
				description: node.rawNode.description,
				emoji: node.rawNode.icônes,
			}
		})
		.filter((option) => option.value !== null)

	const handleChange = useCallback(
		(id: string, isSelected: boolean) => {
			choices.forEach((choice) => {
				const dottedName = choice.dottedName
				const value =
					id === dottedName ? isSelected : engine.evaluate(choice).nodeValue

				if (onChange) {
					onChange(value ? 'oui' : 'non', dottedName)
				}
			})
		},
		[choices, engine, onChange]
	)

	return (
		<ChoixMultiple
			options={options}
			onChange={handleChange}
			id={id}
			aria={aria}
		/>
	)
}
