import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import { EngineContext } from 'Components/utils/EngineContext'
import { ParsedRule, ParsedRules } from 'publicodes'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName } from 'Rules'
import DateInput from './DateInput'
import Input from './Input'
import Question from './Question'
import SelectGéo from './select/SelectGeo'
import SelectAtmp from './select/SelectTauxRisque'
import SendButton from './SendButton'

export const binaryOptionChoices = [
	{ value: 'non', label: 'Non' },
	{ value: 'oui', label: 'Oui' }
]

type Value = string | number | object | boolean | null
export type RuleInputProps = {
	rules: ParsedRules
	dottedName: DottedName
	onChange: (value: Value | null) => void
	useSwitch?: boolean
	isTarget?: boolean
	autoFocus?: boolean
	value?: Value
	className?: string
	onSubmit?: (value: Value) => void
}

// This function takes the unknown rule and finds which React component should
// be displayed to get a user input through successive if statements
// That's not great, but we won't invest more time until we have more diverse
// input components and a better type system.
export default function RuleInput({
	rules,
	dottedName,
	onChange,
	value,
	useSwitch = false,
	isTarget = false,
	autoFocus = false,
	className,
	onSubmit
}: RuleInputProps) {
	const rule = rules[dottedName]
	const unit = rule.unit
	const language = useTranslation().i18n.language
	const engine = useContext(EngineContext)

	const commonProps = {
		key: dottedName,
		dottedName,
		value,
		onChange,
		onSubmit,
		autoFocus,
		className,
		title: rule.title,
		question: rule.question,
		defaultValue: rule.defaultValue,
		suggestions: rule.suggestions
	}
	if (getVariant(rule)) {
		return (
			<Question
				{...commonProps}
				choices={buildVariantTree(rules, dottedName)}
			/>
		)
	}
	if (rule.API && rule.API === 'géo')
		return <SelectGéo {...{ ...commonProps }} />
	if (rule.API) throw new Error("Le seul API implémenté est l'API géo")

	if (rule.dottedName == 'contrat salarié . ATMP . taux collectif ATMP')
		return <SelectAtmp {...commonProps} />

	if (rule.type === 'date') {
		return (
			<DateInput
				value={commonProps.value}
				onChange={commonProps.onChange}
				onSubmit={commonProps.onSubmit}
				suggestions={commonProps.suggestions}
			/>
		)
	}

	if (unit == null) {
		return useSwitch ? (
			<ToggleSwitch
				defaultChecked={value === 'oui' || rule.defaultValue === 'oui'}
				onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
					onChange(evt.target.checked ? 'oui' : 'non')
				}
			/>
		) : (
			<Question {...commonProps} choices={binaryOptionChoices} />
		)
	}

	commonProps.value =
		typeof commonProps.value === 'string'
			? engine.evaluate(commonProps.value as DottedName).nodeValue
			: commonProps.value
	if (unit?.numerators.includes('€') && isTarget) {
		return (
			<>
				<CurrencyInput
					{...commonProps}
					language={language}
					debounce={600}
					value={value as string}
					name={dottedName}
					className="targetInput"
					onChange={evt => onChange(evt.target.value)}
				/>
				{onSubmit && <SendButton disabled={!value} onSubmit={onSubmit} />}
			</>
		)
	}
	if (unit?.numerators.includes('%') && isTarget) {
		return <PercentageField {...commonProps} debounce={600} />
	}

	return <Input {...commonProps} unit={unit} />
}

const getVariant = (rule: ParsedRule) =>
	rule?.formule?.explanation['possibilités']

export const buildVariantTree = <Name extends string>(
	allRules: ParsedRules<Name>,
	path: Name
) => {
	const rec = (path: Name) => {
		const node = allRules[path]
		if (!node) throw new Error(`La règle ${path} est introuvable`)
		const variant = getVariant(node)
		const variants = variant && node.formule.explanation['possibilités']
		const canGiveUp = variant && !node.formule.explanation['choix obligatoire']
		return Object.assign(
			node,
			variant
				? {
						canGiveUp,
						children: variants.map((v: string) => rec(`${path} . ${v}` as Name))
				  }
				: null
		)
	}
	return rec(path)
}
