import NumberInput from '@/components/conversation/NumberInput'
import SelectCommune from '@/components/conversation/select/SelectCommune'
import SelectAtmp from '@/components/conversation/select/SelectTauxRisque'
import { EngineContext } from '@/components/utils/EngineContext'
import { getMeta } from '@/utils'
import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	EvaluatedNode,
	Evaluation,
	PublicodesExpression,
	reduceAST,
	RuleNode,
} from 'publicodes'
import { isEmpty } from 'ramda'
import React, { useContext } from 'react'
import { Choice, MultipleAnswerInput, OuiNonInput } from './ChoicesInput'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectPaysDétachement from './select/SelectPaysDétachement'
import TextInput from './TextInput'

type Props<Names extends string = DottedName> = Omit<
	React.HTMLAttributes<HTMLInputElement>,
	'onChange' | 'defaultValue' | 'onSubmit'
> & {
	required?: boolean
	autoFocus?: boolean
	small?: boolean
	dottedName: Names
	label?: string
	missing?: boolean
	onChange: (value: PublicodesExpression | undefined, dottedName: Names) => void
	// TODO: It would be preferable to replace this "showSuggestions" parameter by
	// a build-in logic in the engine, by setting the "applicability" of
	// suggestions.
	showSuggestions?: boolean
	// TODO: having an option seems undesirable, but it's the easier way to
	// implement this behavior currently
	// cf .https://github.com/betagouv/mon-entreprise/issues/1489#issuecomment-823058710
	showDefaultDateValue?: boolean
	onSubmit?: (source: string) => void

	formatOptions?: Intl.NumberFormatOptions
	displayedUnit?: string
	modifiers?: Record<string, string>
}

export type InputProps<Name extends string = string> = Omit<
	Props<Name>,
	'onChange'
> &
	Pick<RuleNode, 'title' | 'suggestions'> & {
		question: RuleNode['rawNode']['question']
		description: RuleNode['rawNode']['description']
		value: EvaluatedNode['nodeValue']
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
export default function RuleInput<Names extends string = DottedName>({
	dottedName,
	onChange,
	showSuggestions = true,
	onSubmit = () => null,
	showDefaultDateValue = false,
	modifiers = {},
	...props
}: Props<Names>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName, ...modifiers })
	const value = evaluation.nodeValue
	const commonProps: InputProps<Names> = {
		dottedName,
		value,
		missing: !showDefaultDateValue && !isEmpty(evaluation.missingVariables),
		onChange: (value: PublicodesExpression | undefined) =>
			onChange(value, dottedName),
		title: rule.title,
		onSubmit,
		description: rule.rawNode.description,
		id: props.id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: showSuggestions ? rule.suggestions : {},
		...props,
	}
	const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

	if (getVariant(engine.getRule(dottedName))) {
		const type =
			meta.affichage &&
			['radio', 'card', 'toggle', 'select'].includes(meta.affichage)
				? (meta.affichage as 'radio' | 'card' | 'toggle' | 'select')
				: 'radio'

		return (
			<MultipleAnswerInput
				{...commonProps}
				choice={buildVariantTree(engine, dottedName)}
				type={type}
			/>
		)
	}
	if (rule.rawNode.API && rule.rawNode.API === 'commune') {
		return <SelectCommune {...commonProps} />
	}
	if (rule.rawNode.API && rule.rawNode.API.startsWith('pays détachement')) {
		return (
			<SelectPaysDétachement
				{...commonProps}
				plusFrance={rule.rawNode.API.endsWith('plus France')}
			/>
		)
	}
	if (rule.rawNode.API) {
		throw new Error("Les seules API implémentées sont 'commune'")
	}

	if (rule.dottedName === 'contrat salarié . ATMP . taux collectif ATMP') {
		return <SelectAtmp {...commonProps} />
	}

	if (rule.rawNode.type === 'date') {
		return <DateInput {...commonProps} />
	}

	if (
		evaluation.unit == null &&
		['booléen', 'notification', undefined].includes(rule.rawNode.type) &&
		typeof evaluation.nodeValue !== 'number'
	) {
		return <OuiNonInput {...commonProps} />
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
		<NumberInput
			{...commonProps}
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
	if (!node) {
		throw new Error(`La règle ${path} est introuvable`)
	}
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
					)
						.filter((node) => engine.evaluate(node).nodeValue !== null)
						.map(({ dottedName }) =>
							buildVariantTree(engine, dottedName as Name)
						),
			  }
			: null
	) as Choice
}
