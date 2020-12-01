import classnames from 'classnames'
import { Markdown } from 'Components/utils/markdown'
import { ASTNode, References } from 'publicodes'
import { Rule } from 'publicodes/dist/types/rule'
import { useCallback, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Explicable } from './Explicable'
import { binaryQuestion, InputCommonProps, RuleInputProps } from './RuleInput'

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

export type Choice = ASTNode & { nodeKind: 'rule' } & {
	canGiveUp?: boolean
	children: Array<Choice>
}

type QuestionProps = InputCommonProps & {
	onSubmit: (source: string) => void
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
		missing ? null : `'${currentValue}'`
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
	useEffect(() => {
		if (currentSelection != null) {
			const timeoutId = setTimeout(() => onChange(currentSelection), 300)
			return () => clearTimeout(timeoutId)
		}
	}, [currentSelection])

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
					)}
			</ul>
		)
	}

	const choiceElements = Array.isArray(choices)
		? renderBinaryQuestion(choices)
		: renderChildren(choices)

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
	onChange: RuleInputProps['onChange']
	onSubmit: (src: string, value: string) => void
}

function RadioLabelContent({
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
				<Trans>{label}</Trans>
			</span>
		</label>
	)
}
