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

// This is the number of possible answers in this very custom input component
const chipsCount = 7

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

					> li > div > img {
						margin-right: 0.4rem !important;
						font-size: 110%;
					}

					> li {
						width: 14rem;
						margin: 1rem;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 1rem;
					}

					> li h4 {
						margin: 0;
					}
					> li p {
						font-style: italic;
						font-size: 85%;
						line-height: 1.2rem;
					}
				`}
			>
				{dietRules.map(
					([{ name, title, description, dottedName, icônes }, question]) => {
						const situationValue = situation[question.dottedName],
							value =
								situationValue != null ? situationValue : question.defaultValue
						return (
							<li className="ui__ card" key={name}>
								<h4>{title}</h4>
								<div>{emoji(icônes)}</div>

								<p>{description.split('\n')[0]}</p>
								<div css={' span {margin: .8rem; font-size: 120%}'}>
									<button
										className={`ui__ button small plain ${
											!value ? 'disabled' : ''
										}`}
										onClick={() =>
											value > 0 &&
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
				{chipsCount -
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
