import React, { Component } from 'react'
import { FormDecorator } from './FormDecorator'
import { answer, answered } from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Explicable from './Explicable'
import R from 'ramda'

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

let dottedNameToObject = R.pipe(
	R.split(' . '),
	R.reverse,
	R.reduce((memo, next) => ({ [next]: memo }), 'oui')
)

// FormDecorator permet de factoriser du code partagé par les différents types de saisie,
// dont Question est un example
@FormDecorator('question')
export default class Question extends Component {
	render() {
		let { stepProps: { choices } } = this.props

		if (R.is(Array)(choices)) return this.renderBinaryQuestion()
		else return this.renderChildren(choices)
	}
	renderBinaryQuestion() {
		let {
			input, // vient de redux-form
			stepProps: { submit, choices },
			themeColours
		} = this.props

		return (
			<ul>
				{choices.map(({ value, label }) => (
					<RadioLabel
						key={value}
						{...{ value, label, input, submit, themeColours }}
					/>
				))}
			</ul>
		)
	}
	renderChildren(choices) {
		let {
				input, // vient de redux-form
				stepProps,
				themeColours
			} = this.props,
			{ name } = input,
			{ submit } = stepProps,
			// seront stockées ainsi dans le state :
			// [parent object path]: dotted name relative to parent
			relativeDottedName = radioDottedName =>
				radioDottedName.split(name + ' . ')[1]

		return (
			<ul>
				{choices.canGiveUp && (
					<li key="aucun" className="variantLeaf aucun">
						<RadioLabel
							{...{
								value: 'non',
								label: 'Aucun',
								input,
								submit,
								themeColours,
								dottedName: null
							}}
						/>
					</li>
				)}
				{choices.children &&
					choices.children.map(
						({ name, title, dottedName, children }) =>
							children ? (
								<li key={name} className="variant">
									<div>{title}</div>
									{this.renderChildren({ children })}
								</li>
							) : (
								<li key={name} className="variantLeaf">
									<RadioLabel
										{...{
											value: relativeDottedName(dottedName),
											label: title,
											dottedName,
											input,
											submit,
											themeColours
										}}
									/>
								</li>
							)
					)}
			</ul>
		)
	}
}

let RadioLabel = props => (
	<Explicable dottedName={props.dottedName}>
		<RadioLabelContent {...props} />
	</Explicable>
)

@HoverDecorator
class RadioLabelContent extends Component {
	render() {
		let {
				value,
				label,
				input,
				submit,
				hover,
				themeColours,
			} = this.props,
			// value = R.when(R.is(Object), R.prop('value'))(choice),
			labelStyle = Object.assign(
				value === input.value || hover
					? answered(themeColours)
					: answer(themeColours),
				value === '_' ? { fontWeight: 'bold' } : null
			)

		return (
			<label key={value} style={labelStyle} className="radio">
				{label}
				<input
					type="radio"
					{...input}
					onClick={submit}
					value={value}
					checked={value === input.value ? 'checked' : ''}
				/>
			</label>
		)
	}
}
