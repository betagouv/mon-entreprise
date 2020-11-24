import Input from 'Components/conversation/Input'
import Question, { Choice } from 'Components/conversation/Question'
import SelectCommune from 'Components/conversation/select/SelectCommune'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import {
	ASTNode,
	EvaluatedRule,
	evaluateRule,
	ParsedRules,
	reduceAST,
} from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
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
	id?: string
	value: Value
	className?: string
	onSubmit?: (source: string) => void
}

export type InputCommonProps<Name extends string = string> = Pick<
	RuleInputProps<Name>,
	'dottedName' | 'value' | 'onChange' | 'autoFocus' | 'className'
> &
	Pick<EvaluatedRule<Name>, 'title' | 'question' | 'suggestions'> & {
		key: string
		id: string
		missing: boolean
		required: boolean
	}

export const binaryQuestion = [
	{ value: 'oui', label: 'Oui' },
	{ value: 'non', label: 'Non' },
] as const

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
	className,
	onSubmit = () => null,
}: RuleInputProps<Name>) {
	const engine = useContext(EngineContext)
	const rule = evaluateRule(engine, dottedName)
	const language = useTranslation().i18n.language
	const value = rule.nodeValue
	const commonProps: InputCommonProps<Name> = {
		key: dottedName,
		dottedName,
		value,
		missing: !!rule.missingVariables[dottedName],
		onChange,
		autoFocus,
		className,
		title: rule.title,
		id: id ?? dottedName,
		question: rule.question,
		suggestions: rule.suggestions,
		required: true,
	}
	if (getVariant(engine.getParsedRules()[dottedName])) {
		return (
			<Question
				{...commonProps}
				onSubmit={onSubmit}
				choices={buildVariantTree(engine.getParsedRules(), dottedName)}
			/>
		)
	}
	if (rule.API && rule.API === 'commune')
		return <SelectCommune {...commonProps} />
	if (rule.API && rule.API === 'pays européen')
		return <SelectEuropeCountry {...commonProps} />
	if (rule.API) throw new Error("Les seules API implémentées sont 'commune'")

	if (rule.dottedName == 'contrat salarié . ATMP . taux collectif ATMP')
		return <SelectAtmp {...commonProps} onSubmit={onSubmit} />

	if (rule.type === 'date') {
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
		rule.unit == null &&
		(rule.type === 'booléen' || rule.type == undefined) &&
		typeof rule.nodeValue !== 'number'
	) {
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === 'oui'}
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
				]}
				onSubmit={onSubmit}
			/>
		)
	}

	commonProps.value =
		typeof commonProps.value === 'string'
			? engine.evaluate(commonProps.value as DottedName).nodeValue
			: commonProps.value

	if (rule.unit?.numerators.includes('€') && isTarget) {
		return (
			<>
				<CurrencyInput
					{...commonProps}
					language={language}
					debounce={750}
					value={value as string}
					name={dottedName}
					className="targetInput"
					onChange={(evt) => onChange(evt.target.value)}
				/>
			</>
		)
	}
	if (rule.unit?.numerators.includes('%') && isTarget) {
		return <PercentageField {...commonProps} debounce={600} />
	}

	if (rule.type === 'texte') {
		return <TextInput {...commonProps} />
	}
	if (rule.type === 'paragraphe') {
		return <ParagrapheInput {...commonProps} />
	}

	return <Input {...commonProps} onSubmit={onSubmit} unit={rule.unit} />
}

const getVariant = (node: ASTNode & { nodeKind: 'rule' }) =>
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
	allRules: ParsedRules<Name>,
	path: Name
): Choice => {
	const node = allRules[path]
	if (!node) throw new Error(`La règle ${path} est introuvable`)
	const variant = getVariant(node)
	const canGiveUp = variant && !variant['choix obligatoire']
	return Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (variant.explanation as (ASTNode & {
						nodeKind: 'reference'
					})[]).map(({ dottedName }) =>
						buildVariantTree(allRules, dottedName as Name)
					),
			  }
			: null
	) as Choice
}
