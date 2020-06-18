import classnames from 'classnames'
import { ThemeColorsContext } from 'Components/utils/colors'
import { is } from 'ramda'
import React, { useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Explicable } from './Explicable'
import { Markdown } from 'Components/utils/markdown'

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

export default function Question({
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
	// if (choices.length > 4) {
	// 	return <Select {...{choices, onSubmit, dottedName, onChange, value: CurrentValue}}
	// }
	const renderBinaryQuestion = () => {
		return choices.map(({ value, label }, i: number) => (
			<RadioLabel
				key={value}
				{...{
					value,
					css: i < choices.length - 1 ? 'margin-right: 0.6rem' : 0,
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
			<ul css="width: 100%; padding: 0; margin:0">
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
					choices.children.map(
						({ title, dottedName, description, children, icons }) =>
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
											description,
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

export const RadioLabel = props => (
	<>
		<RadioLabelContent {...props} />
		{props.description && (
			<Explicable>
				<h2>{props.label}</h2>
				<Markdown source={props.description} />
			</Explicable>
		)}
	</>
)

function RadioLabelContent({
	value,
	label,
	currentValue,
	icons,
	onChange,
	onSubmit,
	css
}) {
	const labelStyle = value === '_' ? ({ fontWeight: 'bold' } as const) : {}
	const selected = value === currentValue

	const click = value => () => {
		if (currentValue == value && onSubmit) onSubmit('dblClick')
	}

	return (
		<label
			key={value}
			style={labelStyle}
			css={css}
			className={classnames('radio', 'userAnswerButton', 'ui__', 'button', {
				selected
			})}
		>
			{icons && <>{emoji(icons)}&nbsp;</>}
			<Trans>{label}</Trans>
			<input
				type="radio"
				onClick={click(value)}
				value={value}
				onChange={evt => onChange(evt.target.value)}
				checked={selected}
			/>
		</label>
	)
}
