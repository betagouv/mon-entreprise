import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import { useCallback } from 'react'

import { ChoixMultiple, ChoixOption } from '@/design-system'
import { ValeurPublicodes } from '@/domaine/engine/PublicodesAdapter'

import { getMultiplePossibilitiesOptions } from './getMultiplePossibilitiesOptions'

interface PlusieursPossibilitésProps {
	règle: DottedName
	engine: Engine<DottedName>
	onChange?: (selectedChoices: DottedName[]) => void
	value?: ValeurPublicodes
	id?: string
	title?: string
	description?: string
	autoFocus?: boolean
	onSubmit?: (source?: string) => void

	aria?: {
		labelledby?: string
	}
}

export function PlusieursPossibilités({
	règle,
	onChange,
	engine,
	aria = {},
	id,
}: PlusieursPossibilitésProps) {
	const choices = getMultiplePossibilitiesOptions(engine, règle)
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
			if (!onChange) return

			const selectedChoices: DottedName[] = []
			choices.forEach((choice) => {
				const choiceDottedName = choice.dottedName
				const isCurrentlySelected =
					id === choiceDottedName
						? isSelected
						: engine.evaluate(choice).nodeValue === true

				if (isCurrentlySelected) {
					selectedChoices.push(choiceDottedName)
				}
			})

			onChange(selectedChoices)
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
