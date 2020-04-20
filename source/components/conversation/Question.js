import classnames from 'classnames'
import { T } from 'Components'
import { ThemeColorsContext } from 'Components/utils/colors'
import { compose, is } from 'ramda'
import React, { useCallback, useContext, useState } from 'react'
import Explicable from './Explicable'
import { FormDecorator } from './FormDecorator'
import './Question.css'
import SendButton from './SendButton'
import emoji from 'react-easy-emoji'

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans une liste, ou une liste de listes.
	Les données @choices sont un arbre de type:
	- nom: motif CDD # La racine, unique, qui formera la Question. Ses enfants sont les choix possibles
		enfants:
		- nom: motif classique
			enfants:
			- nom: motif saisonnier
			- nom: motif remplacement
		- nom: motif contrat aidé
		- nom: motif complément de formation

	A chaque nom est associé une propriété 'données' contenant l'entité complète (et donc le titre, le texte d'aide etc.) : ce n'est pas à
	ce composant (une vue) d'aller les chercher.

*/

// FormDecorator permet de factoriser du code partagé par les différents types de saisie,
// dont Question est un example
export default compose(FormDecorator('question'))(function Question({
	choices,
	submit,
	name,
	setFormValue,
	value: currentValue
}) {
	const colors = useContext(ThemeColorsContext)
	const [touched, setTouched] = useState(false)
	const onChange = useCallback(
		value => {
			setFormValue(value)
			setTouched(true)
		},
		[setFormValue]
	)

	const renderBinaryQuestion = () => {
		return (
			<div className="binaryQuestionList">
				{choices.map(({ value, label }) => (
					<RadioLabel
						key={value}
						{...{ value, label, currentValue, submit, colors, onChange }}
					/>
				))}
			</div>
		)
	}
	const renderChildren = choices => {
		// seront stockées ainsi dans le state :
		// [parent object path]: dotted name relative to parent
		const relativeDottedName = radioDottedName =>
			radioDottedName.split(name + ' . ')[1]

		return (
			<ul
				css={`
					display: flex;
					justify-content: flex-end;
					flex-wrap: wrap;
				`}
			>
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentValue,
								submit,
								colors,
								dottedName: null,
								onChange
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.map(
						({ name, title, dottedName, icônes, children }) =>
							children ? (
								<li key={name} className="variant" css="width: 100%">
									<div>{title}</div>
									{renderChildren({ children })}
								</li>
							) : (
								<li key={name} className="variantLeaf">
									<RadioLabel
										{...{
											value: relativeDottedName(dottedName),
											label: title,
											icônes,
											dottedName,
											currentValue,
											submit,
											colors,
											onChange
										}}
									/>
								</li>
							)
					)}
			</ul>
		)
	}

	let choiceElements = is(Array)(choices)
		? renderBinaryQuestion()
		: renderChildren(choices)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
			<SendButton
				{...{
					disabled: !touched,
					colors,
					error: false,
					submit
				}}
			/>
		</div>
	)
})

let RadioLabel = props => (
	<>
		<RadioLabelContent {...props} />
		<Explicable dottedName={props.dottedName} />
	</>
)

function RadioLabelContent({
	icônes,
	value,
	label,
	currentValue,
	onChange,
	submit
}) {
	let selected = value === currentValue

	const click = value => () => {
		if (currentValue == value) submit('dblClick')
	}

	return (
		<label
			key={value}
			css={`
				fontweight: ${value === '_' ? 'bold' : 'normal'};
				> img {
					margin-right: 0.3rem !important;
				}
			`}
			className={classnames('radio', 'userAnswerButton', { selected })}
		>
			{icônes && emoji(icônes)}
			<T>{label}</T>
			<input
				type="radio"
				onClick={click(value)}
				value={value}
				onChange={evt => onChange(evt.target.value)}
				checked={value === currentValue ? 'checked' : ''}
			/>
		</label>
	)
}
