import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import SelectCommune from 'Components/conversation/select/SelectCommune'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import Engine, { ASTNode, formatValue, reduceAST } from 'publicodes'
import { Evaluation } from 'publicodes/dist/types/AST/types'
import { RuleNode } from 'publicodes/dist/types/rule'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectEuropeCountry from './select/SelectEuropeCountry'
import TextInput from './TextInput'

type Value = any
export type RuleInputProps<Name extends string = DottedName> = {
	dottedName: Name
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	required?: boolean
	id?: string
	className?: string
	onSubmit?: (source: string) => void
}

export type InputCommonProps<Name extends string = string> = Pick<
	RuleInputProps<Name>,
	'dottedName' | 'onChange' | 'autoFocus' | 'className'
> &
	Pick<RuleNode, 'title' | 'suggestions'> & {
		question: RuleNode['rawNode']['question']
		key: string
		id: string
		value: any //TODO EvaluatedRule['nodeValue']
		missing: boolean
		required: boolean
	}

// This function takes the unknown rule and finds which React component should
// be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse
// input components and a better type system.
export default function RuleInput<Name extends string = DottedName>({
	dottedName,
	onChange,
	useSwitch = false,
	id,
	isTarget = false,
	autoFocus = false,
	required = true,
	className,
	onSubmit = () => null,
}: RuleInputProps<Name>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate(dottedName)
	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue
	const commonProps: InputCommonProps<Name> = {
		key: dottedName,
		dottedName,
		value,
		missing: !!evaluation.missingVariables[dottedName],
		onChange,
		autoFocus,
		className,
		required,
		title: rule.title,
		id: id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: rule.suggestions,
	}
	if (getVariant(engine.getRule(dottedName))) {
		return (
			<Question
				{...commonProps}
				onSubmit={onSubmit}
				choices={buildVariantTree(engine, dottedName)}
			/>
		)
	}
	if (rule.rawNode.API && rule.rawNode.API === 'commune')
		return <SelectCommune {...commonProps} />
	if (rule.rawNode.API && rule.rawNode.API === 'pays européen')
		return <SelectEuropeCountry {...commonProps} />
	if (rule.rawNode.API)
		throw new Error("Les seules API implémentées sont 'commune'")

	if (rule.dottedName == 'contrat salarié . ATMP . taux collectif ATMP')
		return <SelectAtmp {...commonProps} onSubmit={onSubmit} />

	if (rule.rawNode.type === 'date') {
		return (
			<DateInput
				{...commonProps}
				value={commonProps.value}
				onChange={commonProps.onChange}
				onSubmit={onSubmit}
				suggestions={commonProps.suggestions}
			/>
		)
	}

	if (
		evaluation.unit == null &&
		(rule.rawNode.type === 'booléen' || rule.rawNode.type == undefined) &&
		typeof evaluation.nodeValue !== 'number'
	) {
		// TODO : super hacky, we need to find a way to read the missing variables
		// of the 'par défaut' expression
		const defaultValueIsAnswerable =
			typeof rule.rawNode?.['par défaut'] === 'object'
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === true}
				onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
					onChange(evt.target.checked ? 'oui' : 'non')
				}
			/>
		) : (
			<Question
				{...commonProps}
				choices={[
					{ value: 'oui', label: 'Oui' },
					{ value: 'non', label: 'Non' },
					...(defaultValueIsAnswerable
						? [{ value: null, label: 'Je ne sais pas' }]
						: []),
				]}
				onSubmit={onSubmit}
			/>
		)
	}

	if (evaluation.unit?.numerators.includes('€') && isTarget) {
		const unité = formatValue(
			{ nodeValue: value ?? 0, unit: evaluation.unit },
			{ language }
		)
			.replace(/[\d,.]/g, '')
			.trim()
		return (
			<>
				<CurrencyInput
					{...commonProps}
					language={language}
					debounce={750}
					value={value as string}
					name={dottedName}
					className="targetInput"
					onChange={(evt) => onChange({ valeur: evt.target.value, unité })}
				/>
			</>
		)
	}
	if (evaluation.unit?.numerators.includes('%') && isTarget) {
		return <PercentageField {...commonProps} debounce={600} />
	}
	if (rule.rawNode.type === 'texte') {
		return <TextInput {...commonProps} value={value as Evaluation<string>} />
	}
	if (rule.rawNode.type === 'paragraphe') {
		return (
			<ParagrapheInput {...commonProps} value={value as Evaluation<string>} />
		)
	}

	return (
		<Input
			{...commonProps}
			onSubmit={onSubmit}
			unit={evaluation.unit}
			value={value as Evaluation<number>}
		/>
	)
}

const getVariant = (node: RuleNode) =>
	reduceAST<false | (ASTNode & { nodeKind: 'une possibilité' })>(
		(_, node) => {
			if (node.nodeKind === 'une possibilité') {
				return node
			}
		},
		false,
		node
	)

export const buildVariantTree = <Name extends string>(
	engine: Engine<Name>,
	path: Name
): Choice => {
	const node = engine.getRule(path)
	if (!node) throw new Error(`La règle ${path} est introuvable`)
	const variant = getVariant(node)
	const canGiveUp =
		variant &&
		(!variant['choix obligatoire'] || variant['choix obligatoire'] === 'non')
	return Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (variant.explanation as (ASTNode & {
						nodeKind: 'reference'
					})[]).map(({ dottedName }) =>
						buildVariantTree(engine, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
