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
import { useDispatch, useSelector } from 'react-redux'
import { situationSelector } from 'Selectors/analyseSelectors'
import { updateSituation } from 'Actions/actions'

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
	const dispatch = useDispatch()
	const situation = useSelector(situationSelector)

	console.log('DIETRULES', dietRules)

	return (
		<div>
			<ul
				css={`
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					p {
						text-align: center;
					}

					> li {
						width: 12rem;
						margin: 1rem;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 1rem;
					}

					> li h4 {
					}
					> li p {
						font-style: italic;
					}
				`}
			>
				{dietRules.map(
					([{ name, title, description, dottedName, icônes }, question]) => {
						const value =
							situation[question.dottedName] || question.defaultValue
						return (
							<li className="ui__ card" key={name}>
								<h4>{title}</h4>
								<p>{description}</p>
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<button
										className="ui__ button small plain"
										onClick={() =>
											dispatch(updateSituation(question.dottedName, value - 1))
										}
									>
										-
									</button>
									<span>{value}</span>
									<button
										className="ui__ button small plain"
										onClick={() =>
											dispatch(updateSituation(question.dottedName, value + 1))
										}
									>
										+
									</button>
								</div>
							</li>
						)
					}
				)}
			</ul>
			<p>
				Il vous reste{' '}
				{7 -
					dietRules.reduce(
						(memo, [_, { dottedName }]) => memo + situation[dottedName] || 0,
						0
					)}{' '}
				choix à faire.
			</p>
		</div>
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
