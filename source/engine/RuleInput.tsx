import Input from 'Components/conversation/Input'
import Question from 'Components/conversation/Question'
import SelectGéo from 'Components/conversation/select/SelectGéo'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import SendButton from 'Components/conversation/SendButton'
import CurrencyInput from 'Components/CurrencyInput/CurrencyInput'
import PercentageField from 'Components/PercentageField'
import ToggleSwitch from 'Components/ui/ToggleSwitch'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DottedName, Rule } from 'Types/rule'
import DateInput from '../components/conversation/DateInput'

export const binaryOptionChoices = [
	{ value: 'non', label: 'Non' },
	{ value: 'oui', label: 'Oui' }
]

type Value = string | number | object | boolean
type Props = {
	rules: { [name in DottedName]: Rule }
	dottedName: DottedName
	onChange: (value: Value) => void
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
}: Props) {
	let rule = rules[dottedName]
	let unit = rule.unit || rule.defaultUnit
	let language = useTranslation().i18n.language

	let commonProps = {
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

let getVariant = rule => rule?.formule?.explanation['une possibilité']

export let buildVariantTree = (allRules, path) => {
	let rec = path => {
		let node = allRules[path]
		if (!node) throw new Error(`La règle ${path} est introuvable`)
		let variant = getVariant(node),
			variants = variant && node.formule.explanation['possibilités'],
			shouldBeExpanded = variant && true, //variants.find( v => relevantPaths.find(rp => contains(path + ' . ' + v)(rp) )),
			canGiveUp = variant && !node.formule.explanation['choix obligatoire']

		return Object.assign(
			node,
			shouldBeExpanded
				? {
						canGiveUp,
						children: (variants as any).map(v => rec(path + ' . ' + v))
				  }
				: null
		)
	}
	return rec(path)
}
