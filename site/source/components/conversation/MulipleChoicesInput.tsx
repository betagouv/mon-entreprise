import { DottedName } from 'modele-social'
import { PublicodesExpression, RuleNode } from 'publicodes'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { usePromise } from '@/hooks/usePromise'
import {
	usePromiseOnSituationChange,
	useWorkerEngine,
	WorkerEngine,
} from '@/worker/socialWorkerEngineClient'

import { ExplicableRule } from './Explicable'
import { InputProps, RuleWithMultiplePossibilities } from './RuleInput'

export function MultipleChoicesInput<Names extends string = DottedName>(
	props: Omit<InputProps<DottedName>, 'onChange'> & {
		engineId: number
		onChange: (value: PublicodesExpression, name: DottedName) => void
	}
) {
	const { engineId, dottedName, onChange } = props
	const workerEngine = useWorkerEngine()
	const choices = usePromise(
		() => getMultiplePossibilitiesOptions(workerEngine, engineId, dottedName),
		[dottedName, engineId, workerEngine],
		[] as RuleNode<DottedName>[]
	)

	const handleChange = (isSelected: boolean, dottedName: DottedName) => {
		// As soon as one option is selected, all the others are not missing anymore
		return Promise.all(
			choices.map(async (choice) => {
				const value =
					dottedName === choice.dottedName
						? isSelected
						: (await workerEngine.asyncEvaluate(choice)).nodeValue
				onChange(value ? 'oui' : 'non', choice.dottedName)
			})
		)
	}

	return (
		<div aria-labelledby="questionHeader" role="group">
			{choices.map((node) => (
				<Fragment key={node.dottedName}>
					<CheckBoxRule
						node={node}
						onChange={(isSelected) =>
							void handleChange(isSelected, node.dottedName)
						}
						engineId={engineId}
					/>
				</Fragment>
			))}
		</div>
	)
}

type CheckBoxRuleProps = {
	node: RuleNode
	engineId: number
	onChange: (isSelected: boolean) => void
}
function CheckBoxRule({ node, engineId, onChange }: CheckBoxRuleProps) {
	const workerEngine = useWorkerEngine()

	const evaluation = usePromiseOnSituationChange(
		() => workerEngine.asyncEvaluate(node),
		[engineId, node, workerEngine]
	)
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
				aria-label={t("Plus d'infos sur, {{ title }}", {
					title: node.title,
				})}
			/>
			<br />
		</>
	)
}

async function getMultiplePossibilitiesOptions(
	workerEngine: WorkerEngine,
	engineId: number,
	// engine: Engine<Name>,
	dottedName: DottedName
): Promise<RuleNode<DottedName>[]> {
	// return (
	// 	(engine.getRule(dottedName) as RuleWithMultiplePossibilities).rawNode[
	// 		'plusieurs possibilités'
	// 	] ?? []
	// ).map((name) => engine.getRule(`${dottedName} . ${name}` as Name))
	const posibilities =
		(
			(await workerEngine.asyncGetRule(
				dottedName
			)) as RuleWithMultiplePossibilities
		).rawNode['plusieurs possibilités'] ?? []

	return await Promise.all(
		posibilities.map((name) =>
			workerEngine.asyncGetRule(`${dottedName} . ${name}` as DottedName)
		)
	)
}
