import React, { Component } from 'react'
import { Trans, translate } from 'react-i18next'
import { FormDecorator } from './FormDecorator'
import { answer, answered } from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Explicable from './Explicable'
import { pipe, split, reverse, reduce, is } from 'ramda'
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
@FormDecorator('question')
@translate()
export default class Question extends Component {
	render() {
		let { choices, submit, themeColours, meta: { pristine } } = this.props
		let choiceElements = is(Array)(choices)
			? this.renderBinaryQuestion()
			: this.renderChildren(choices)
		return (
			<>
				{choiceElements}
				<SendButton
					{...{
						disabled: pristine,
						themeColours,
						error: false,
						submit
					}}
				/>
			</>
		)
	}
	renderBinaryQuestion() {
		let {
			input, // vient de redux-form
			submit,
			choices,
			setFormValue,
			themeColours
		} = this.props

		return (
			<ul>
				{choices.map(({ value, label }) => (
					<RadioLabel
						key={value}
						{...{ value, label, input, submit, themeColours, setFormValue }}
					/>
				))}
			</ul>
		)
	}
	renderChildren(choices) {
		let {
				input, // vient de redux-form
				submit,
				setFormValue,
				themeColours
			} = this.props,
			{ name } = input,
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
								dottedName: null,
								setFormValue
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
											themeColours,
											setFormValue
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
@translate()
class RadioLabelContent extends Component {
	click = value => () => {
		if (this.props.input.value == value) this.props.submit('dblClick')
	}
	render() {
		let { value, label, input, hover, themeColours } = this.props,
			// value = when(is(Object), prop('value'))(choice),
			labelStyle = Object.assign(
				value === input.value || hover
					? answered(themeColours)
					: answer(themeColours),
				value === '_' ? { fontWeight: 'bold' } : null
			)

		return (
			<label key={value} style={labelStyle} className="radio">
				<Trans i18nKey={`radio_${label}`}>{label}</Trans>
				<input
					type="radio"
					{...input}
					onClick={this.click(value)}
					value={value}
					checked={value === input.value ? 'checked' : ''}
				/>
			</label>
		)
	}
}
