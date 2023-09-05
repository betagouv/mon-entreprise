import {
	useAsyncGetRule,
	useWorkerEngine,
	WorkerEngine,
} from '@publicodes/worker-react'
import { DottedName } from 'modele-social'
import {
	ASTNode,
	EvaluatedNode,
	Evaluation,
	PublicodesExpression,
	reduceAST,
	RuleNode,
} from 'publicodes'
import React, { useEffect } from 'react'

import NumberInput from '@/components/conversation/NumberInput'
import SelectCommune from '@/components/conversation/select/SelectCommune'
import { DateFieldProps } from '@/design-system/field/DateField'
import { usePromise } from '@/hooks/usePromise'
import { getMeta, isNotNull } from '@/utils'

import { Choice, MultipleAnswerInput, OuiNonInput } from './ChoicesInput'
import DateInput from './DateInput'
import { MultipleChoicesInput } from './MulipleChoicesInput'
import ParagrapheInput from './ParagrapheInput'
import SelectPaysDétachement from './select/SelectPaysDétachement'
import SelectAtmp from './select/SelectTauxRisque'
import TextInput from './TextInput'

type InputType = 'radio' | 'card' | 'toggle' | 'select'

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
	inputType?: InputType
	formatOptions?: Intl.NumberFormatOptions
	displayedUnit?: string
	modifiers?: Record<string, string>
	// engine?: Engine<DottedName>
	engineId?: number
}

export type InputProps<Name extends string = string> = Omit<
	Props<Name>,
	'onChange' | 'engine'
> &
	Pick<RuleNode, 'suggestions'> & {
		question: RuleNode['rawNode']['question']
		description: RuleNode['rawNode']['description']
		value: EvaluatedNode['nodeValue']
		onChange: (value: PublicodesExpression | undefined) => void
		// engine: Engine<Name>
		engineId: number
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
	missing,
	inputType,
	modifiers,
	engineId = 0,
	...props
}: Props<DottedName>) {
	// const defaultEngine = useContext(EngineContext)

	// const engineValue = (engine ?? defaultEngine) as Engine<Names>

	const workerEngine = useWorkerEngine()

	const rule = useAsyncGetRule(dottedName)

	// const evaluation = engineValue.evaluate({ valeur: dottedName, ...modifiers })
	// async
	const evaluation = usePromise(
		() =>
			workerEngine.asyncEvaluate({
				valeur: dottedName,
				...(modifiers ?? {}),
			}),
		[dottedName, modifiers, workerEngine]
	)

	const value = evaluation?.nodeValue

	const isMultipleChoices = usePromise(
		async () =>
			rule && isMultiplePossibilities(workerEngine, engineId, dottedName),
		[dottedName, engineId, rule, workerEngine]
	)

	console.log('=>', dottedName)

	const choice = usePromise(
		() => getOnePossibilityOptions(workerEngine, dottedName),
		[workerEngine, dottedName]
	)

	dottedName === 'entreprise . activité . nature' &&
		console.log(
			'choice',
			isMultipleChoices,
			choice,
			rule && isOnePossibility(rule)
		)

	if (!rule || isMultipleChoices === undefined) {
		return <p>Chargement...</p>
	}

	const commonProps: InputProps<DottedName> = {
		dottedName,
		value,
		missing:
			missing ??
			(!showDefaultDateValue &&
				evaluation &&
				dottedName in evaluation.missingVariables),
		onChange: (value: PublicodesExpression | undefined) =>
			onChange(value, dottedName),
		onSubmit,
		title: rule.title,
		description: rule.rawNode.description,
		question: rule.rawNode.question,
		suggestions: showSuggestions ? rule.suggestions : {},
		// engine: engineValue,
		engineId,
		...props,
		// Les espaces ne sont pas autorisés dans un id, les points sont assimilés à une déclaration de class CSS par Cypress
		id: props?.id?.replace(/\s|\.]/g, '_') ?? dottedName.replace(/\s|\./g, '_'),
	}
	const meta = getMeta<{ affichage?: string }>(rule.rawNode, {})

	if (isMultipleChoices) {
		return (
			<MultipleChoicesInput
				{...commonProps}
				engineId={engineId}
				onChange={onChange}
			/>
		)
	}

	if (isOnePossibility(rule) && choice) {
		const type =
			inputType ??
			(meta.affichage &&
			['radio', 'card', 'toggle', 'select'].includes(meta.affichage)
				? (meta.affichage as 'radio' | 'card' | 'toggle' | 'select')
				: 'radio')

		return <MultipleAnswerInput {...commonProps} choice={choice} type={type} />
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
		return `<SelectPaysDétachement
				{...commonProps}
				plusFrance={rule.rawNode.API.endsWith('plus France')}
			/>`
	}
	if (rule.rawNode.API) {
		throw new Error(
			"Les seules API implémentées sont 'commune' et 'pays détachement'"
		)
	}

	if (rule.dottedName === 'établissement . taux ATMP . taux collectif') {
		return '<SelectAtmp {...commonProps} />'
	}

	if (rule.rawNode.type?.startsWith('date')) {
		return `<DateInput
				{...commonProps}
				type={rule.rawNode.type as DateFieldProps['type']}
			/>`
	}

	if (
		evaluation?.unit == null &&
		['booléen', 'notification', undefined].includes(rule.rawNode.type) &&
		typeof evaluation?.nodeValue !== 'number'
	) {
		return <OuiNonInput {...commonProps} />
	}

	if (rule.rawNode.type === 'texte') {
		return `<TextInput
				{...commonProps}
				label={undefined}
				value={value as Evaluation<string>}
			/>`
	}
	if (rule.rawNode.type === 'paragraphe') {
		return '<ParagrapheInput {...commonProps} value={value as Evaluation<string>} />'
	}

	// Pas de title sur NumberInput pour avoir une bonne expérience avec
	// lecteur d'écran
	delete commonProps.title

	return (
		<NumberInput
			{...commonProps}
			unit={evaluation?.unit}
			value={value as Evaluation<number>}
		/>
	)
}

const isOnePossibility = (node: RuleNode) =>
	reduceAST<false | (ASTNode & { nodeKind: 'une possibilité' })>(
		(_, node) => {
			if (node.nodeKind === 'une possibilité') {
				return node
			}
		},
		false,
		node
	)

const getOnePossibilityOptions = async (
	workerEngine: WorkerEngine,
	// engineId: number,
	path: DottedName
): Promise<Choice> => {
	const node = await workerEngine.asyncGetRule(path)

	// if (path === 'entreprise . activité . nature') debugger

	if (!node) {
		throw new Error(`La règle ${path} est introuvable`)
	}
	const variant = isOnePossibility(node)
	const canGiveUp =
		variant &&
		(!variant['choix obligatoire'] || variant['choix obligatoire'] === 'non')

	const ttt = Object.assign(
		node,
		variant
			? {
					canGiveUp,
					children: (
						await Promise.all(
							(
								variant.explanation as (ASTNode & { nodeKind: 'reference' })[]
							).map(async (explanation) => {
								console.log('=>>>>', explanation)

								const evaluate = await workerEngine.asyncEvaluate(explanation)

								return evaluate.nodeValue !== null
									? await getOnePossibilityOptions(
											workerEngine,
											explanation.dottedName as DottedName
									  )
									: null
							})
						)
					).filter(isNotNull),
			  }
			: null
	) as Choice

	console.log('choice=>', ttt)

	return ttt
}

export type RuleWithMultiplePossibilities = RuleNode & {
	rawNode: RuleNode['rawNode'] & {
		'plusieurs possibilités'?: Array<string>
	}
}

async function isMultiplePossibilities(
	workerEngine: WorkerEngine,
	engineId: number,
	//  Engine<Name>,
	dottedName: DottedName
): Promise<boolean> {
	// return !!(engine.getRule(dottedName) as RuleWithMultiplePossibilities)
	// 	.rawNode['plusieurs possibilités']

	return !!(
		(await workerEngine.asyncGetRule(
			dottedName
		)) as RuleWithMultiplePossibilities
	).rawNode['plusieurs possibilités']
}
