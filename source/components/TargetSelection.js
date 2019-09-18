import { updateSituation } from 'Actions/actions'
import { T } from 'Components'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import { ThemeColoursContext } from 'Components/utils/withColours'
import withSitePaths from 'Components/utils/withSitePaths'
import { encodeRuleName } from 'Engine/rules'
import { isEmpty, isNil } from 'ramda'
import React, { useEffect, useState, useContext } from 'react'
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

export default function TargetSelection() {
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
	const colours = useContext(ThemeColoursContext)

	const targets =
		analysis?.targets.filter(
			t =>
				!secondaryObjectives.includes(t.dottedName) &&
				t.dottedName !== 'contrat salarié . aides employeur'
		) || []

	useEffect(() => {
		// Initialize defaultValue for target that can't be computed
		// TODO: this logic shouldn't be here
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

		setInitialRender(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
}

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

	const isActiveInput = activeInput === target.dottedName
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
								isActiveInput
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
								isActiveInput,
								isSmallTarget
							}}
						/>
					</div>
					{isActiveInput && (
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

export const formatCurrency = (value, language) => {
	return value == null
		? ''
		: Intl.NumberFormat(language, {
				style: 'currency',
				currency: 'EUR',
				maximumFractionDigits: 0,
				minimumFractionDigits: 0
		  })
				.format(value)
				.replace(/^€/, '€ ')
}

let TargetInputOrValue = ({ target, isActiveInput, isSmallTarget }) => {
	const { i18n } = useTranslation()
	const colors = useContext(ThemeColoursContext)
	const dispatch = useDispatch()
	const situationValue = useSituationValue(target.dottedName)
	const targetWithValue = useTarget(target.dottedName)
	const value = targetWithValue?.nodeValue?.toFixed(0)
	const inversionFail = useSelector(
		state => analysisWithDefaultsSelector(state)?.cache.inversionFail
	)
	const blurValue = inversionFail && !isActiveInput && value

	return (
		<span
			className="targetInputOrValue"
			style={blurValue ? { filter: 'blur(3px)' } : {}}>
			{target.question ? (
				<>
					{!isActiveInput && <AnimatedTargetValue value={value} />}
					<CurrencyInput
						style={{
							color: colors.textColour,
							borderColor: colors.textColour
						}}
						debounce={600}
						name={target.dottedName}
						value={situationValue || value}
						className={
							isActiveInput || isNil(value) ? 'targetInput' : 'editableTarget'
						}
						onChange={evt =>
							dispatch(updateSituation(target.dottedName, evt.target.value))
						}
						onBlur={event => event.preventDefault()}
						// We use onMouseDown instead of onClick because that's when the browser moves the cursor
						onMouseDown={() => {
							if (isSmallTarget) return
							dispatch({
								type: 'SET_ACTIVE_TARGET_INPUT',
								name: target.dottedName
							})
							// TODO: This shouldn't be necessary: we don't need to recalculate the situation
							// when the user just focus another field. Removing this line is almost working
							// however there is a weird bug in the selection of the next question.
							if (value) {
								dispatch(updateSituation(target.dottedName, '' + value))
							}
						}}
						{...(isActiveInput ? { autoFocus: true } : {})}
						language={i18n.language}
					/>
					<span className="targetInputBottomBorder">
						{formatCurrency(value, i18n.language)}
					</span>
				</>
			) : (
				<span>
					{Number.isNaN(value) ? '—' : formatCurrency(value, i18n.language)}
				</span>
			)}
			{target.dottedName.includes('rémunération . total') && <AidesGlimpse />}
		</span>
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
						<AnimatedTargetValue value={aides.nodeValue}>
							<span>{formatCurrency(aides.nodeValue)}</span>
						</AnimatedTargetValue>
					</strong>{' '}
					<T>d'aides</T> {emoji(aides.icons)}
				</RuleLink>
			</div>
		</Animate.appear>
	)
}
