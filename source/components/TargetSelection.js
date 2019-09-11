import classNames from 'classnames'
import { T } from 'Components'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PercentageField from 'Components/PercentageField'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import withColours from 'Components/utils/withColours'
import withLanguage from 'Components/utils/withLanguage'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import { serialiseUnit } from 'Engine/units'
import { compose, isEmpty, isNil, propEq } from 'ramda'
import React, { memo, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { change, Field, formValueSelector, reduxForm } from 'redux-form'
import {
	analysisWithDefaultsSelector,
	flatRulesSelector
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default compose(
	withTranslation(),
	withColours,
	reduxForm({
		form: 'conversation',
		destroyOnUnmount: false
	}),
	connect(
		state => ({
			getTargetValue: dottedName =>
				formValueSelector('conversation')(state, dottedName),
			analysis: analysisWithDefaultsSelector(state),
			flatRules: flatRulesSelector(state),
			activeInput: state.activeTargetInput,
			objectifs: state.simulation?.config.objectifs || [],
			secondaryObjectives:
				state.simulation?.config['objectifs secondaires'] || []
		}),
		dispatch => ({
			setFormValue: (field, name) =>
				dispatch(change('conversation', field, name)),
			setActiveInput: name =>
				dispatch({ type: 'SET_ACTIVE_TARGET_INPUT', name })
		})
	),
	memo
)(function TargetSelection({
	secondaryObjectives,
	analysis,
	getTargetValue,
	setFormValue,
	colours,
	activeInput,
	setActiveInput,
	objectifs
}) {
	const [initialRender, setInitialRender] = useState(true)

	useEffect(() => {
		let targets = getTargets()
		// Initialize defaultValue for target that can't be computed
		targets
			.filter(
				target =>
					(!target.formule || isEmpty(target.formule)) &&
					(!isNil(target.defaultValue) ||
						!isNil(target.explanation?.defaultValue)) &&
					!getTargetValue(target.dottedName)
			)

			.forEach(target => {
				setFormValue(
					target.dottedName,
					!isNil(target.defaultValue)
						? target.defaultValue
						: target.explanation?.defaultValue
				)
			})

		if (initialRender) {
			setInitialRender(false)
		}
	}, [])

	const getTargets = () => {
		if (!analysis) return []
		return analysis.targets.filter(
			t =>
				!secondaryObjectives.includes(t.dottedName) &&
				t.dottedName !== 'contrat salarié . aides employeur'
		)
	}

	let targets = getTargets()

	return (
		<div id="targetSelection">
			{(typeof objectifs[0] === 'string' ? [{ objectifs }] : objectifs).map(
				({ icône, objectifs: groupTargets, nom }, index) => (
					<React.Fragment key={nom || '0'}>
						<div style={{ display: 'flex', alignItems: 'end' }}>
							<div style={{ flex: 1 }}>
								{nom && (
									<h2 style={{ marginBottom: 0 }}>
										{emoji(icône)} <T>{nom}</T>
									</h2>
								)}
							</div>
							{index === 0 && <PeriodSwitch />}
						</div>
						<section
							className="ui__ plain card"
							style={{
								marginTop: '.6em',
								color: colours.textColour,
								background: `linear-gradient(
								60deg,
								${colours.darkColour} 0%,
								${colours.colour} 100%
								)`
							}}>
							<Targets
								{...{
									activeInput,
									setActiveInput,
									setFormValue,
									targets: targets.filter(({ dottedName }) =>
										groupTargets.includes(dottedName)
									),
									initialRender
								}}
							/>
						</section>
					</React.Fragment>
				)
			)}
		</div>
	)
})

let Targets = ({
	activeInput,
	setActiveInput,
	setFormValue,
	targets,
	initialRender
}) => (
	<div>
		<ul className="targets">
			{targets
				.map(target => target.explanation || target)
				.filter(target => {
					return (
						target.isApplicable !== false &&
						(target.question || target.nodeValue)
					)
				})
				.map(target => (
					<Target
						key={target.dottedName}
						initialRender={initialRender}
						{...{
							target,
							setFormValue,
							activeInput,
							setActiveInput,
							targets
						}}
					/>
				))}
		</ul>
	</div>
)

const Target = ({
	target,
	activeInput,

	targets,
	setActiveInput,
	setFormValue,
	initialRender
}) => {
	const isSmallTarget =
		!target.question || !target.formule || isEmpty(target.formule)

	return (
		<li
			key={target.name}
			className={isSmallTarget ? 'small-target' : undefined}>
			<Animate.appear unless={initialRender}>
				<div>
					<div className="main">
						<Header
							{...{
								target,

								isActiveInput: activeInput === target.dottedName
							}}
						/>
						{isSmallTarget && (
							<span
								style={{
									flex: 1,
									borderBottom: '1px dashed #ffffff91',
									marginLeft: '1rem'
								}}
							/>
						)}
						<TargetInputOrValue
							{...{
								target,
								targets,
								activeInput,
								setActiveInput,
								setFormValue
							}}
						/>
					</div>
					{activeInput === target.dottedName && (
						<Animate.fromTop>
							<InputSuggestions
								suggestions={target.suggestions}
								onFirstClick={value => {
									setFormValue(target.dottedName, '' + value)
								}}
								rulePeriod={target.période}
								colouredBackground={true}
							/>
						</Animate.fromTop>
					)}
				</div>
			</Animate.appear>
		</li>
	)
}

let Header = withSitePaths(({ target, sitePaths }) => {
	const ruleLink =
		sitePaths.documentation.index + '/' + encodeRuleName(target.dottedName)
	return (
		<span className="header">
			<span className="texts">
				<span className="optionTitle">
					<Link to={ruleLink}>{target.title || target.name}</Link>
				</span>
				<p>{target.summary}</p>
			</span>
		</span>
	)
})

let CurrencyField = withColours(props => {
	return (
		<CurrencyInput
			style={{
				color: props.colours.textColour,
				borderColor: props.colours.textColour
			}}
			debounce={600}
			className="targetInput"
			value={props.input.value}
			{...props.input}
			{...props}
		/>
	)
})
let DebouncedPercentageField = props => (
	<PercentageField debounce={600} {...props} />
)

let TargetInputOrValue = withLanguage(
	({
		target,
		targets,
		activeInput,
		setActiveInput,
		language,
		firstStepCompleted
	}) => {
		let inputIsActive = activeInput === target.dottedName
		return (
			<span className="targetInputOrValue">
				{inputIsActive || !target.formule || isEmpty(target.formule) ? (
					<Field
						name={target.dottedName}
						onBlur={event => event.preventDefault()}
						component={
							{ '€': CurrencyField, '%': DebouncedPercentageField }[
								serialiseUnit(target.unit)
							]
						}
						{...(inputIsActive ? { autoFocus: true } : {})}
						language={language}
					/>
				) : (
					<TargetValue
						{...{
							targets,
							target,
							activeInput,
							setActiveInput,
							firstStepCompleted
						}}
					/>
				)}
				{target.dottedName.includes('rémunération . total') && <AidesGlimpse />}
			</span>
		)
	}
)

const TargetValue = connect(
	state => ({
		blurValue: analysisWithDefaultsSelector(state)?.cache.inversionFail
	}),
	dispatch => ({
		setFormValue: (field, name) => dispatch(change('conversation', field, name))
	})
)(function TargetValue({
	targets,
	target,
	blurValue,
	setFormValue,
	activeInput,
	setActiveInput
}) {
	let targetWithValue = targets?.find(propEq('dottedName', target.dottedName)),
		value = targetWithValue && targetWithValue.nodeValue

	const showField = value => () => {
		if (!target.question) return
		if (value != null && !Number.isNaN(value))
			setFormValue(target.dottedName, Math.round(value) + '')

		if (activeInput) setFormValue(activeInput, '')
		setActiveInput(target.dottedName)
	}

	return (
		<div
			className={classNames({
				editable: target.question,
				attractClick: target.question && isNil(target.nodeValue)
			})}
			style={blurValue ? { filter: 'blur(3px)' } : {}}
			{...(target.question ? { tabIndex: 0 } : {})}
			onClick={showField(value)}
			onFocus={showField(value)}>
			<AnimatedTargetValue value={value} />
		</div>
	)
})

const AidesGlimpse = compose(
	withRouter,
	connect(state => ({ analysis: analysisWithDefaultsSelector(state) }))
)(({ analysis: { targets }, colours }) => {
	const aides = targets?.find(
		t => t.dottedName === 'contrat salarié . aides employeur'
	)
	if (!aides || !aides.nodeValue) return null
	return (
		<Animate.appear>
			<div className="aidesGlimpse">
				<RuleLink {...aides}>
					-{' '}
					<strong>
						<AnimatedTargetValue value={aides.nodeValue} />
					</strong>{' '}
					<T>d'aides</T> {emoji(aides.icons)}
				</RuleLink>
			</div>
		</Animate.appear>
	)
})
