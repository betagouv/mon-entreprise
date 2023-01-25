import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression, RuleNode } from 'publicodes'

import { Checkbox } from '@/design-system'
import { Emoji } from '@/design-system/emoji'

import { ExplicableRule } from './Explicable'
import { InputProps } from './RuleInput'

export function MultipleChoicesInput<Names extends string = DottedName>(
	props: Omit<InputProps<Names>, 'onChange'> & {
		choices: Array<RuleNode>
		onChange: (value: PublicodesExpression, name: Names) => void
	}
) {
	const handleChange = (isSelected: boolean, dottedName: Names) => {
		// As soon as one option is selected, all the others are not missing anymore
		return props.choices.forEach((choice) => {
			const value =
				dottedName === choice.dottedName
					? isSelected
					: props.engine.evaluate(choice).nodeValue
			props.onChange(value ? 'oui' : 'non', choice.dottedName)
		})
	}

	return (
		<>
			{props.choices.map((node) => (
				<>
					<CheckBoxRule
						key={node.dottedName}
						node={node}
						onChange={(isSelected) =>
							handleChange(isSelected, node.dottedName as Names)
						}
						engine={props.engine}
					/>
					<br />
				</>
			))}
		</>
	)
}

type CheckBoxRuleProps = {
	node: RuleNode
	engine: Engine
	onChange: (isSelected: boolean) => void
}
function CheckBoxRule({ node, engine, onChange }: CheckBoxRuleProps) {
	const evaluation = engine.evaluate(node)
	if (evaluation.nodeValue === null) {
		return null
	}

	return (
		<>
			<Checkbox
				defaultSelected={evaluation.nodeValue === true}
				id={`checkbox-input-${node.dottedName.replace(/\s|\./g, '_')}`}
				label={node.title}
				onChange={(isSelected) => onChange(isSelected)}
			/>
			{node.rawNode.icônes && <Emoji emoji={node.rawNode.icônes} />}{' '}
			<ExplicableRule
				light
				dottedName={node.dottedName as DottedName}
				aria-label={`En savoir plus sur ${node.title}`}
			/>
		</>
	)
}
