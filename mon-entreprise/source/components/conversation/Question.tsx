import classnames from 'classnames'
import { useDebounce } from 'Components/utils'
import { Markdown } from 'Components/utils/markdown'
import { DottedName } from 'modele-social'
import { EvaluatedNode, Rule, RuleNode, serializeEvaluation } from 'publicodes'
import { References } from 'publicodes-react'
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Explicable } from './Explicable'
import { binaryQuestion, InputProps } from './RuleInput'

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans
	une liste, ou une liste de listes. Les données @choices sont un arbre de type:
	- nom: motif CDD # La racine, unique, qui formera la Question. Ses enfants
	  sont les choix possibles enfants:
	  - nom: motif classique enfants:
	    - nom: motif saisonnier
	    - nom: motif remplacement
	  - nom: motif contrat aidé
	  - nom: motif complément de formation

	A chaque nom est associé une propriété 'données' contenant l'entité complète
	(et donc le titre, le texte d'aide etc.) : ce n'est pas à ce composant (une
	vue) d'aller les chercher.

*/

export type Choice = RuleNode & {
	canGiveUp?: boolean
	children: Array<Choice>
}

type QuestionProps = InputProps & {
	onSubmit: (source: string) => void
	dottedName: DottedName
	choices: Choice | typeof binaryQuestion
}

export default function Question({
	choices,
	onSubmit,
	dottedName: questionDottedName,
	missing,
	onChange,
	value: currentValue,
}: QuestionProps) {
	const [currentSelection, setCurrentSelection] = useState(
		missing
			? null
			: serializeEvaluation({ nodeValue: currentValue } as EvaluatedNode)
	)
	const handleChange = useCallback(
		(value) => {
			setCurrentSelection(value)
		},
		[setCurrentSelection]
	)
	const handleSubmit = useCallback(
		(src, value) => {
			setCurrentSelection(value)
			onChange(value)
			onSubmit(src)
		},
		[onSubmit, onChange, setCurrentSelection]
	)

	const debouncedSelection = useDebounce(currentSelection, 300)
	useEffect(() => {
		if (
			debouncedSelection !== null &&
			(missing ||
				serializeEvaluation({ nodeValue: currentValue } as EvaluatedNode) !==
					debouncedSelection)
		) {
			onChange(debouncedSelection)
		}
	}, [debouncedSelection])

	const hiddenOptions = useContext(HiddenOptionContext)

	const renderBinaryQuestion = (choices: typeof binaryQuestion) => {
		return choices.map(({ value, label }) => (
			<span
				key={value}
				css={`
					:not(:first-child) {
						margin-left: 0.6rem;
					}
					input {
						width: 0;
						opacity: 0;
						height: 0;
						position: absolute;
					}
				`}
			>
				<RadioLabel
					{...{
						value,
						label,
						currentSelection,
						onSubmit: handleSubmit,
						name: questionDottedName,
						onChange: handleChange,
					}}
				/>
			</span>
		))
	}
	const renderChildren = (choices: Choice) => {
		// seront stockées ainsi dans le state :
		// [parent object path]: dotted fieldName relative to parent
		const relativeDottedName = (radioDottedName: string) =>
			radioDottedName.split(questionDottedName + ' . ')[1]
		return (
			<ul css="width: 100%; padding: 0; margin:0" className="ui__ radio">
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentSelection,
								name: questionDottedName,
								onSubmit: handleSubmit,
								dottedName: null,
								onChange: handleChange,
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.map(
						({
							title,
							dottedName,
							rawNode: { description, icônes, références },
							children,
						}) =>
							children ? (
								<li key={dottedName} className="variant">
									<div>{title}</div>
									{renderChildren({ children } as Choice)}
								</li>
							) : (
								!hiddenOptions.includes(dottedName as DottedName) && (
									<li key={dottedName} className="variantLeaf">
										<RadioLabel
											{...{
												value: `'${relativeDottedName(dottedName)}'`,
												label: title,
												dottedName,
												currentSelection,
												name: questionDottedName,
												icônes,
												onSubmit: handleSubmit,
												description,
												références,
												onChange: handleChange,
											}}
										/>
									</li>
								)
							)
					)}
			</ul>
		)
	}

	const choiceElements = Array.isArray(choices)
		? renderBinaryQuestion(choices as unknown as typeof binaryQuestion)
		: renderChildren(choices as Choice)

	return (
		<div
			className="step question"
			css={`
				margin: 0.3rem 0;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			`}
		>
			{choiceElements}
		</div>
	)
}

type RadioLabelProps = RadioLabelContentProps & {
	description?: string
	label?: string
	références?: Rule['références']
}

export const RadioLabel = (props: RadioLabelProps) => (
	<>
		<RadioLabelContent {...props} />
		{props.description && (
			<Explicable>
				<h2>{props.label}</h2>
				<Markdown source={props.description} />
				{props.références && (
					<>
						<h3>
							<Trans>En savoir plus</Trans>
						</h3>
						<References refs={props.références} />
					</>
				)}
			</Explicable>
		)}
	</>
)

type RadioLabelContentProps = {
	value: string
	label: string
	name: string
	currentSelection?: null | string
	icônes?: string
	onChange: InputProps['onChange']
	onSubmit: (src: string, value: string) => void
}

export function RadioLabelContent({
	value,
	label,
	name,
	currentSelection,
	icônes,
	onChange,
	onSubmit,
}: RadioLabelContentProps) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentSelection

	return (
		<label
			key={value}
			onDoubleClick={() => {
				onSubmit('dblClick', value)
			}}
			style={labelStyle}
			className={classnames('userAnswerButton ui__ button', {
				selected,
			})}
		>
			<input
				type="radio"
				name={name}
				value={value}
				onChange={(evt) => onChange(evt.target.value)}
				checked={selected}
			/>
			<span>
				{icônes && <>{emoji(icônes)}&nbsp;</>}
				{label}
			</span>
		</label>
	)
}

// TODO : This is hacky, the logic to hide/disable some of the possible answer
// to a mutliple-choice question must be handled by Publicodes. We use a React
// context instead of passing down props to avoid polluting to much code with
// this undesirable option.
export const HiddenOptionContext = createContext<Array<DottedName>>([])
