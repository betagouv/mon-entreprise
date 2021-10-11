import NumberInput from 'Components/conversation/NumberInput'
import SelectCommune from 'Components/conversation/select/SelectCommune'
import SelectAtmp from 'Components/conversation/select/SelectTauxRisque'
import { EngineContext } from 'Components/utils/EngineContext'
import { DottedName } from 'modele-social'
import Engine, {
	ASTNode,
	EvaluatedNode,
	Evaluation,
	PublicodesExpression,
	reduceAST,
	RuleNode,
} from 'publicodes'
import React, { useContext } from 'react'
import { Choice, MultipleAnswerInput, OuiNonInput } from './ChoicesInput'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectPaysDétachement from './select/SelectPaysDétachement'
import TextInput from './TextInput'

type Props<Name extends string = DottedName> = Omit<
	React.HTMLAttributes<HTMLInputElement>,
	'onChange' | 'defaultValue' | 'onSubmit'
> & {
	required?: boolean
	autoFocus?: boolean
	small?: boolean
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
	showSuggestions = true,
	onSubmit = () => null,
	showDefaultDateValue = false,
	modifiers = {},
	...props
}: Props<DottedName>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName, ...modifiers })
	const value = evaluation.nodeValue
	const commonProps: InputProps<DottedName> = {
		dottedName,
		value,
		missing: !showDefaultDateValue && !!evaluation.missingVariables[dottedName],
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
	if (getVariant(engine.getRule(dottedName))) {
		return (
			<MultipleAnswerInput
				{...commonProps}
				choice={buildVariantTree(engine, dottedName)}
			/>
		)
	}
	if (rule.rawNode.API && rule.rawNode.API === 'commune')
		return <SelectCommune {...commonProps} />
	if (rule.rawNode.API && rule.rawNode.API === 'pays détachement')
		return <SelectPaysDétachement {...commonProps} />
	if (rule.rawNode.API)
		throw new Error("Les seules API implémentées sont 'commune'")

	if (rule.dottedName == 'contrat salarié . ATMP . taux collectif ATMP')
		return <SelectAtmp {...commonProps} />

	if (rule.rawNode.type === 'date') {
		return <DateInput {...commonProps} />
	}

	if (
		evaluation.unit == null &&
		(rule.rawNode.type === 'booléen' || rule.rawNode.type == undefined) &&
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
