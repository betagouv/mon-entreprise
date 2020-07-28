import classnames from 'classnames'
import { T } from 'Components'
import { ThemeColorsContext } from 'Components/utils/colors'
import { compose, is } from 'ramda'
import React, { useCallback, useContext, useState } from 'react'
import Explicable from 'Components/conversation/Explicable'
import { FormDecorator } from 'Components/conversation/FormDecorator'
import 'Components/conversation/Question.css'
import SendButton from 'Components/conversation/SendButton'
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
export default compose(FormDecorator('selectWeeklyDiet'))(function Question({
	submit,
	name,
	setFormValue,
	dietRules,
	value: currentValue,
}) {
	console.log('DIETRULES', dietRules)

	return (
		<ul
			css={`
				display: flex;
				justify-content: flex-end;
				flex-wrap: wrap;

				> li {
					max-width: 12rem;
				}
			`}
		>
			{dietRules.map(([{ name, title, dottedName, icônes, value = 8 }]) => (
				<li key={name}>
					<div css="border: 1px solid var(--color)">{title}</div>
					<button onClick={() => null}>-</button>
					{value}
					<button onClick={() => null}>+</button>
				</li>
			))}
		</ul>
	)

	return (
		<div css="margin-top: 0.6rem; display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end">
			{choiceElements}
			<SendButton
				{...{
					disabled: !touched,
					colors,
					error: false,
					submit,
				}}
			/>
		</div>
	)
})

let RadioLabel = (props) => (
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
	submit,
}) {
	let selected = value === currentValue

	const click = (value) => () => {
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
				onChange={(evt) => onChange(evt.target.value)}
				checked={value === currentValue ? 'checked' : ''}
			/>
		</label>
	)
}
