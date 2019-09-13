import classnames from 'classnames'
import withColours from 'Components/utils/withColours'
import { compose, is } from 'ramda'
import React, { useCallback, useState } from 'react'
import { Trans } from 'react-i18next'
import Explicable from './Explicable'
import { FormDecorator } from './FormDecorator'
import './Question.css'
import SendButton from './SendButton'

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
export default compose(
	FormDecorator('question'),
	withColours
)(function Question({
	choices,
	submit,
	colours,
	name,
	setFormValue,
	value: currentValue
}) {
	const [touched, setTouched] = useState(false)
	const onChange = useCallback(value => {
		setFormValue(value)
		setTouched(true)
	})

	const renderBinaryQuestion = () => {
		return (
			<div className="binaryQuestionList">
				{choices.map(({ value, label }) => (
					<RadioLabel
						key={value}
						{...{ value, label, currentValue, submit, colours, onChange }}
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
			<ul css="width: 100%">
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								currentValue,
								submit,
								colours,
								dottedName: null,
								onChange
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.map(({ name, title, dottedName, children }) =>
						children ? (
							<li key={name} className="variant">
								<div>{title}</div>
								{renderChildren({ children })}
							</li>
						) : (
							<li key={name} className="variantLeaf">
								<RadioLabel
									{...{
										value: relativeDottedName(dottedName),
										label: title,
										dottedName,
										currentValue,
										submit,
										colours,
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
					colours,
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

const RadioLabelContent = compose(withColours)(function RadioLabelContent({
	value,
	label,
	currentValue,
	onChange,
	submit
}) {
	let labelStyle = value === '_' ? { fontWeight: 'bold' } : null,
		selected = value === currentValue

	const click = value => () => {
		if (currentValue == value) submit('dblClick')
	}

	return (
		<label
			key={value}
			style={labelStyle}
			className={classnames('radio', 'userAnswerButton', { selected })}>
			<Trans i18nKey={`radio_${label}`}>{label}</Trans>
			<input
				type="radio"
				onClick={click(value)}
				value={value}
				onChange={evt => onChange(evt.target.value)}
				checked={value === currentValue ? 'checked' : ''}
			/>
		</label>
	)
})
