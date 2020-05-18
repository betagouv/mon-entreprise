import { ThemeColorsContext } from 'Components/utils/colors'
import { is } from 'ramda'
import React, { useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { ExplicableRule } from './Explicable'
import SendButton from './SendButton'
import { CSSProp } from 'styled-components'
import { Explicable } from 'Components/conversation/Explicable'

type QuestionProps = {
	question: React.ReactNode
	explication?: string
	currentValue?: RadioLabelContentProps['currentValue']
	onChange: RadioLabelContentProps['onChange']
	choices: Array<{
		value: RadioLabelContentProps['value']
		label?: RadioLabelContentProps['label']
	}>
}

export function Question({
	question,
	explication,
	currentValue,
	choices,
	onChange
}: QuestionProps) {
	return (
		<div
			className="step question"
			// css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap;"
		>
			{explication ? (
				<p>
					{question} <Explicable>{explication}</Explicable>
				</p>
			) : (
				<p>{question}</p>
			)}
			{choices.map(({ value, label }) => (
				<RadioLabelContent
					key={value}
					value={value}
					label={label}
					currentValue={currentValue}
					onChange={onChange}
				/>
			))}
		</div>
	)
}

type BooleanQuestionProps = Omit<
	QuestionProps,
	'choices' | 'onChange' | 'currentValue'
> & {
	currentValue?: boolean | null
	onChange: (val: boolean) => void
}

export function BooleanQuestion({
	currentValue,
	onChange,
	...otherProps
}: BooleanQuestionProps) {
	return (
		<Question
			currentValue={
				currentValue === undefined
					? undefined
					: currentValue === true
					? 'Oui'
					: 'Non'
			}
			choices={[
				{
					value: 'Oui'
				},
				{ value: 'Non' }
			]}
			onChange={val => onChange(val === 'Oui')}
			{...otherProps}
		/>
	)
}

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

export default function RuleQuestion({
	choices,
	onSubmit,
	dottedName,
	onChange,
	value: currentValue
}) {
	const colors = useContext(ThemeColorsContext)
	const handleChange = useCallback(
		value => {
			onChange(value)
		},
		[onChange]
	)

	const renderBinaryQuestion = () => {
		return choices.map(({ value, label }) => (
			<RadioLabel
				key={value}
				{...{
					value,
					css: 'margin-right: 0.6rem',
					label,
					currentValue,
					onSubmit,
					colors,
					onChange: handleChange
				}}
			/>
		))
	}
	const renderChildren = choices => {
		// seront stockées ainsi dans le state :
		// [parent object path]: dotted fieldName relative to parent
		const relativeDottedName = radioDottedName =>
			radioDottedName.split(dottedName + ' . ')[1]

		return (
			<ul css="width: 100%">
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentValue,
								onSubmit,
								colors,
								dottedName: null,
								onChange: handleChange
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.map(({ title, dottedName, children, icons }) =>
						children ? (
							<li key={dottedName} className="variant">
								<div>{title}</div>
								{renderChildren({ children })}
							</li>
						) : (
							<li key={dottedName} className="variantLeaf">
								<RadioLabel
									{...{
										value: `'${relativeDottedName(dottedName)}'`,
										label: title,
										dottedName,
										currentValue,
										icons,
										onSubmit,
										colors,
										onChange: handleChange
									}}
								/>
							</li>
						)
					)}
			</ul>
		)
	}

	const choiceElements = is(Array)(choices)
		? renderBinaryQuestion()
		: renderChildren(choices)

	return (
		<div
			className="step question"
			css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap;"
		>
			{choiceElements}
			{onSubmit && <SendButton disabled={!currentValue} onSubmit={onSubmit} />}
		</div>
	)
}

export const RadioLabel = props => (
	<>
		<RadioLabelContent {...props} />
		<ExplicableRule dottedName={props.dottedName} />
	</>
)

type RadioLabelContentProps = {
	value: string
	label?: string
	currentValue?: string
	icons?: string
	onChange?: (newValue: string) => void
	onSubmit?: (source: string) => void
	css?: CSSProp
}

function RadioLabelContent({
	value,
	label,
	currentValue,
	icons,
	onChange,
	onSubmit,
	css
}: RadioLabelContentProps) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentValue

	const onClick = () => {
		if (selected) {
			onSubmit?.('dblClick')
		}
	}

	return (
		<label
			key={value}
			style={labelStyle}
			css={css}
			className={`ui__ button radio userAnswerButton ${
				selected ? 'selected' : ''
			}`}
		>
			{icons && <>{emoji(icons)}&nbsp;</>}
			{label ?? value}
			<input
				type="radio"
				onClick={onClick}
				value={value}
				onChange={evt => onChange?.(evt.target.value)}
				checked={selected}
			/>
		</label>
	)
}
