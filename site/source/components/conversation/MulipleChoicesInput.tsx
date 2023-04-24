import { DottedName } from 'modele-social'
import Engine, { PublicodesExpression, RuleNode } from 'publicodes'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/design-system'
import { Emoji } from '@/design-system/emoji'

import { ExplicableRule } from './Explicable'
import { InputProps } from './RuleInput'

export function MultipleChoicesInput<Names extends string = DottedName>(
	props: Omit<InputProps<Names>, 'onChange'> & {
		choices: Array<RuleNode<Names>>
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
		<div aria-labelledby="questionHeader" role="group">
			{props.choices.map((node) => (
				<Fragment key={node.dottedName}>
					<CheckBoxRule
						node={node}
						onChange={(isSelected) => handleChange(isSelected, node.dottedName)}
						engine={props.engine}
					/>
				</Fragment>
			))}
		</div>
	)
}

type CheckBoxRuleProps = {
	node: RuleNode
	engine: Engine
	onChange: (isSelected: boolean) => void
}
function CheckBoxRule({ node, engine, onChange }: CheckBoxRuleProps) {
	const evaluation = engine.evaluate(node)
	const { t } = useTranslation()
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
				aria-label={t("Plus d'infos sur, {{ tile }}", {
					title: node.title,
				})}
			/>
			<br />
		</>
	)
}
