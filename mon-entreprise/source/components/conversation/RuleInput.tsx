import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import SelectCommune from 'Components/conversation/select/SelectCommune'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	formatValue,
	PublicodesExpression,
	reduceAST,
} from 'publicodes'
import { EvaluatedNode, Evaluation } from 'publicodes/dist/types/AST/types'
import { RuleNode } from 'publicodes/dist/types/rule'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectEuropeCountry from './select/SelectEuropeCountry'
import TextInput from './TextInput'

type Props<Name extends string = DottedName> = Omit<
	React.HTMLAttributes<HTMLInputElement>,
	'onChange' | 'defaultValue' | 'onSubmit'
> & {
	required?: boolean
	autoFocus?: boolean
	dottedName: Name
	onChange: (
		value: PublicodesExpression | undefined,
		dottedName: DottedName
	) => void
	// TODO: It would be preferable to replace this "showSuggestions" parameter by
	// a build-in logic in the engine, by setting the "applicability" of
	// suggestions.
	showSuggestions?: boolean
	// TODO: having an option seems undesirable, but it's the easier way to
	// implement this behavior currently
	// cf .https://github.com/betagouv/mon-entreprise/issues/1489#issuecomment-823058710
	showDefaultDateValue?: boolean
	useSwitch?: boolean
	isTarget?: boolean
	onSubmit?: (source: string) => void
	modifiers?: Record<string, string>
}

export type InputProps<Name extends string = string> = Omit<
	Props<Name>,
	'onChange'
> &
	Pick<RuleNode, 'title' | 'suggestions'> & {
		question: RuleNode['rawNode']['question']
		value: EvaluatedNode['nodeValue']
		missing: boolean
		onChange: (value: PublicodesExpression | undefined) => void
	}

export const binaryQuestion = [
	{ value: 'oui', label: 'Oui' },
	{ value: 'non', label: 'Non' },
] as const

// This function takes the unknown rule and finds which React component should
// be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse
// input components and a better type system.
export default function RuleInput({
	dottedName,
	onChange,
	useSwitch = false,
	isTarget = false,
	showSuggestions = true,
	onSubmit = () => null,
	showDefaultDateValue = false,
	modifiers = {},
	...props
}: Props<DottedName>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName, ...modifiers })
	const language = useTranslation().i18n.language
	const value = evaluation.nodeValue
	const commonProps: InputProps<DottedName> = {
		dottedName,
		value,
		missing: !showDefaultDateValue && !!evaluation.missingVariables[dottedName],
		onChange: (value: PublicodesExpression | undefined) =>
			onChange(value, dottedName),
		title: rule.title,
		id: props.id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: showSuggestions ? rule.suggestions : {},
		...props,
	}
	if (getVariant(engine.getRule(dottedName))) {
		return (
			<Question
				{...commonProps}
				dottedName={dottedName}
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
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === true}
				onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
					commonProps.onChange(evt.target.checked ? 'oui' : 'non')
				}
			/>
		) : (
			<Question
				{...commonProps}
				dottedName={dottedName}
				choices={[
					{ value: 'oui', label: 'Oui' },
					{ value: 'non', label: 'Non' },
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
					className="targetInput"
					language={language}
					debounce={750}
					name={dottedName}
					{...commonProps}
					onSubmit={() => {}}
					onChange={(evt) =>
						commonProps.onChange({ valeur: evt.target.value, unité })
					}
					value={value as number}
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
					children: (
						variant.explanation as (ASTNode & {
							nodeKind: 'reference'
						})[]
					).map(({ dottedName }) =>
						buildVariantTree(engine, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
