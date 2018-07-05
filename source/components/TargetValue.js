import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import './TargetValue.css'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import withColours from './withColours'
import { Field, change } from 'redux-form'
import { connect } from 'react-redux'
import { propEq } from 'ramda'

@withColours
@connect(
	() => ({}),
	dispatch => ({
		setFormValue: (field, name) => dispatch(change('conversation', field, name))
	})
)
export default class TargetValue extends React.Component {
	render() {
		let {
			targets,
			target,
			activeInput,
			noUserInput,
			blockingInputControls,
			language
		} = this.props

		let targetWithValue =
				targets && targets.find(propEq('dottedName', target.dottedName)),
			value = targetWithValue && targetWithValue.nodeValue,
			computedValueStyle = { color: this.props.colours.textColour },
			validInput = !(noUserInput || blockingInputControls)

		if (!target.question)
			return this.renderTransition(
				value,
				<span
					style={computedValueStyle}
					className={validInput ? 'computedValue' : ''}>
					{validInput ? this.formatFigure(value) : ''}
				</span>
			)

		if (target.dottedName !== activeInput)
			return this.renderTransition(
				value,
				<input
					className={validInput ? 'computedValue' : ''}
					style={computedValueStyle}
					readOnly="true"
					onFocus={this.changeActiveInput(value)}
					onClick={this.changeActiveInput(value)}
					value={validInput ? this.formatFigure(value) : ''}
				/>
			)
		return (
			<span className="targetValueContainer">
				<Field
					className="targetValue"
					name={target.dottedName}
					component={CurrencyField}
					language={language}
				/>
			</span>
		)
	}
	changeActiveInput(value) {
		let { setFormValue, activeInput, target, setActiveInput } = this.props
		return () => {
			if (activeInput) setFormValue(activeInput, '')
			if (value != null) setFormValue(target.dottedName, Math.floor(value) + '')
			setActiveInput(target.dottedName)
		}
	}
	renderTransition = (value, child) => (
		<ReactCSSTransitionGroup
			className="targetValueContainer"
			transitionName="flash"
			transitionEnterTimeout={100}
			transitionLeaveTimeout={100}>
			<span key={value} className="targetValue">
				{child}
			</span>
		</ReactCSSTransitionGroup>
	)
	formatFigure = value =>
		Intl.NumberFormat(this.props.language, {
			style: 'currency',
			currency: 'EUR',
			maximumFractionDigits: 0,
			minimumFractionDigits: 0
		}).format(value)
}

let CurrencyField = props => {
	return (
		<CurrencyInput
			className="targetInput"
			autoFocus
			{...props.input}
			{...props}
		/>
	)
}
