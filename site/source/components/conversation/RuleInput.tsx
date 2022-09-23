import NumberInput from '@/components/conversation/NumberInput'
import SelectCommune from '@/components/conversation/select/SelectCommune'
import { EngineContext } from '@/components/utils/EngineContext'
import { useShouldFocusField } from '@/hooks/useShouldFocusField'
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
import React, { useContext } from 'react'
import { Choice, MultipleAnswerInput, OuiNonInput } from './ChoicesInput'
import DateInput from './DateInput'
import ParagrapheInput from './ParagrapheInput'
import SelectPaysDétachement from './select/SelectPaysDétachement'
import SelectAtmp from './select/SelectTauxRisque'
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
	onSubmit?: (source?: string) => void
	inputType?: 'radio' | 'card' | 'toggle' | 'select'
	formatOptions?: Intl.NumberFormatOptions
	displayedUnit?: string
	modifiers?: Record<string, string>
}

export type InputProps<Name extends string = string> = Omit<
	Props<Name>,
	'onChange'
> &
	Pick<RuleNode, 'suggestions'> & {
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
	missing,
	inputType,
	modifiers = {},
	...props
}: Props<Names>) {
	const engine = useContext(EngineContext)
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({ valeur: dottedName, ...modifiers })
	const value = evaluation.nodeValue

	const shouldFocusField = useShouldFocusField()

	const commonProps: InputProps<Names> = {
		dottedName,
		value,
		missing:
			missing ??
			(!showDefaultDateValue && dottedName in evaluation.missingVariables),
		onChange: (value: PublicodesExpression | undefined) =>
			onChange(value, dottedName),
		onSubmit,
		title: rule.title,
		description: rule.rawNode.description,
		id: props.id ?? dottedName,
		question: rule.rawNode.question,
		suggestions: showSuggestions ? rule.suggestions : {},
		autoFocus: shouldFocusField,
		...props,
	}
	const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

	if (getVariant(engine.getRule(dottedName))) {
		const type =
			inputType ??
			(meta.affichage &&
			['radio', 'card', 'toggle', 'select'].includes(meta.affichage)
				? (meta.affichage as 'radio' | 'card' | 'toggle' | 'select')
				: 'radio')

		return (
			<MultipleAnswerInput
				{...commonProps}
				choice={buildVariantTree(engine, dottedName)}
				type={type}
			/>
		)
	}

	if (rule.rawNode.API && rule.rawNode.API === 'commune') {
		return (
			<SelectCommune
				{...commonProps}
				onChange={(c) => commonProps.onChange({ batchUpdate: c })}
				value={value as Evaluation<string>}
			/>
		)
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
		throw new Error(
			"Les seules API implémentées sont 'commune' et 'pays détachement'"
		)
	}

	if (rule.dottedName === 'établissement . taux ATMP . taux collectif') {
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

	// Pas de title sur NumberInput pour avoir une bonne expérience avec
	// lecteur d'écran
	delete commonProps.title

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
