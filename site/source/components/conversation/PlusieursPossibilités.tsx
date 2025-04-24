import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	EvaluatedNode,
	PublicodesExpression,
	RuleNode,
} from 'publicodes'

import { ChoixMultiple, ChoixOption } from '@/design-system/field/choix'

interface PlusieursPossibilitésProps {
	value: EvaluatedNode['nodeValue']
	choices: Array<RuleNode<DottedName>>
	onChange: (value: PublicodesExpression, name: DottedName) => void
	engine: Engine<DottedName>
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

	const handleChange = (id: string, isSelected: boolean) => {
		return choices.forEach((choice) => {
			const value =
				id === choice.dottedName
					? isSelected
					: engine.evaluate(choice).nodeValue
			onChange(value ? 'oui' : 'non', choice.dottedName)
		})
	}

	return (
		<ChoixMultiple
			options={options}
			onChange={handleChange}
			id={id}
			aria={aria}
		/>
	)
}
