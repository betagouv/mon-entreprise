import { updateSituation } from 'Actions/actions'
import classNames from 'classnames'
import { T } from 'Components'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PercentageField from 'Components/PercentageField'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import withColours from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import { serialiseUnit } from 'Engine/units'
import { compose, isEmpty, isNil } from 'ramda'
import React, { memo, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
	analysisWithDefaultsSelector,
	useSituation,
	useSituationValue,
	useTarget
} from 'Selectors/analyseSelectors'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default compose(
	withColours,
	memo
)(function TargetSelection({ colours }) {
	const [initialRender, setInitialRender] = useState(true)
	const analysis = useSelector(analysisWithDefaultsSelector)
	const objectifs = useSelector(
		state => state.simulation?.config.objectifs || []
	)
	const secondaryObjectives = useSelector(
		state => state.simulation?.config['objectifs secondaires'] || []
	)
	const situation = useSituation()
	const dispatch = useDispatch()

	useEffect(() => {
		let targets = getTargets()
		// Initialize defaultValue for target that can't be computed
		targets
			.filter(
				target =>
					(!target.formule || isEmpty(target.formule)) &&
					(!isNil(target.defaultValue) ||
						!isNil(target.explanation?.defaultValue)) &&
					!situation[target.dottedName]
			)

			.forEach(target => {
				dispatch(
					updateSituation(
						target.dottedName,
						!isNil(target.defaultValue)
							? target.defaultValue
							: target.explanation?.defaultValue
					)
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

let Targets = ({ targets, initialRender }) => (
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
							target
						}}
					/>
				))}
		</ul>
	</div>
)

const Target = ({ target, initialRender }) => {
	const activeInput = useSelector(state => state.activeTargetInput)
	const dispatch = useDispatch()

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
								activeInput
							}}
						/>
					</div>
					{activeInput === target.dottedName && (
						<Animate.fromTop>
							<InputSuggestions
								suggestions={target.suggestions}
								onFirstClick={value => {
									dispatch(updateSituation(target.dottedName, '' + value))
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

let DebouncedCurrencyField = withColours(props => {
	return (
		<CurrencyInput
			style={{
				color: props.colours.textColour,
				borderColor: props.colours.textColour
			}}
			debounce={600}
			className="targetInput"
			{...props}
		/>
	)
})
let DebouncedPercentageField = props => (
	<PercentageField debounce={600} {...props} />
)

let TargetInputOrValue = ({ target, activeInput }) => {
	const { i18n } = useTranslation()
	const dispatch = useDispatch()
	const situationValue = useSituationValue(target.dottedName)

	let inputIsActive = activeInput === target.dottedName
	const Component = {
		'€': DebouncedCurrencyField,
		'%': DebouncedPercentageField
	}[serialiseUnit(target.unit)]
	return (
		<span className="targetInputOrValue">
			{inputIsActive || !target.formule || isEmpty(target.formule) ? (
				<Component
					name={target.dottedName}
					value={situationValue}
					onChange={evt =>
						dispatch(updateSituation(target.dottedName, evt.target.value))
					}
					onBlur={event => event.preventDefault()}
					{...(inputIsActive ? { autoFocus: true } : {})}
					language={i18n.language}
				/>
			) : (
				<TargetValue target={target} />
			)}
			{target.dottedName.includes('rémunération . total') && <AidesGlimpse />}
		</span>
	)
}

function TargetValue({ target }) {
	const blurValue = useSelector(
		state => analysisWithDefaultsSelector(state)?.cache.inversionFail
	)
	const targetWithValue = useTarget(target.dottedName)
	const dispatch = useDispatch()

	const value = targetWithValue?.nodeValue
	const showField = value => () => {
		if (!target.question) return
		if (value != null && !Number.isNaN(value))
			dispatch(updateSituation(target.dottedName, Math.round(value) + ''))

		dispatch({ type: 'SET_ACTIVE_TARGET_INPUT', name: target.dottedName })
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
}

function AidesGlimpse() {
	const aides = useTarget('contrat salarié . aides employeur')
	if (!aides?.nodeValue) return null
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
}
