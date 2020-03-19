import { setActiveTarget, updateSituation } from 'Actions/actions'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import { ThemeColorsContext } from 'Components/utils/colors'
import { SitePathsContext } from 'Components/utils/withSitePaths'
import { formatCurrency } from 'Engine/format'
import { isEmpty, isNil } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	analysisWithDefaultsSelector,
	situationSelector,
	useTarget
} from 'Selectors/analyseSelectors'
import { Rule } from 'Types/rule'
import Animate from 'Ui/animate'
import AnimatedTargetValue from 'Ui/AnimatedTargetValue'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default function TargetSelection({ showPeriodSwitch = true }) {
	const [initialRender, setInitialRender] = useState(true)
	const analysis = useSelector(analysisWithDefaultsSelector)
	const objectifs = useSelector(
		(state: RootState) => state.simulation?.config.objectifs || []
	)
	const secondaryObjectives = useSelector(
		(state: RootState) =>
			state.simulation?.config['objectifs secondaires'] || []
	)
	const situation = useSelector(situationSelector)
	const dispatch = useDispatch()
	const colors = useContext(ThemeColorsContext)

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
			{((typeof objectifs[0] === 'string'
				? [{ objectifs }]
				: objectifs) as any).map(
				({ icône, objectifs: groupTargets, nom }, index) => (
					<React.Fragment key={nom || '0'}>
						<div style={{ display: 'flex', alignItems: 'end' }}>
							<div style={{ flex: 1 }}>
								{nom && (
									<h2 style={{ marginBottom: 0 }}>
										{emoji(icône)} <Trans>{nom}</Trans>
									</h2>
								)}
							</div>
							{index === 0 && showPeriodSwitch && <PeriodSwitch />}
						</div>
						<section
							className="ui__ plain card"
							style={{
								marginTop: '.6em',
								color: colors.textColor,
								background: `linear-gradient(
								60deg,
								${colors.darkColor} 0%,
								${colors.color} 100%
								)`
							}}
						>
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
	const activeInput = useSelector((state: RootState) => state.activeTargetInput)
	const dispatch = useDispatch()

	const isActiveInput = activeInput === target.dottedName
	const isSmallTarget = !!target.question !== !!target.formule
	return (
		<li
			key={target.name}
			className={isSmallTarget ? 'small-target' : undefined}
		>
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
							<div css="display: flex; justify-content: flex-end">
								<InputSuggestions
									suggestions={target.suggestions}
									onFirstClick={value => {
										dispatch(updateSituation(target.dottedName, value))
									}}
									unit={target.defaultUnit}
								/>
							</div>
						</Animate.fromTop>
					)}
				</div>
			</Animate.appear>
		</li>
	)
}

let Header = ({ target }) => {
	const sitePaths = useContext(SitePathsContext)
	return (
		<span className="header">
			<span className="texts">
				<span className="optionTitle">
					<Link to={sitePaths.documentation.rule(target.dottedName)}>
						{target.title || target.name}
					</Link>
				</span>
				<p>{target.summary}</p>
			</span>
		</span>
	)
}

type TargetInputOrValueProps = {
	target: Rule
	isActiveInput: boolean
	isSmallTarget: boolean
}

let TargetInputOrValue = ({
	target,
	isActiveInput,
	isSmallTarget
}: TargetInputOrValueProps) => {
	const { language } = useTranslation().i18n
	const colors = useContext(ThemeColorsContext)
	const dispatch = useDispatch()
	const situationValue = useSelector(situationSelector)[target.dottedName]

	const targetWithValue = useTarget(target.dottedName)
	const inversionFail = useSelector(analysisWithDefaultsSelector)?.cache._meta
		.inversionFail
	const value =
		targetWithValue?.nodeValue != null && !inversionFail
			? Math.round(targetWithValue.nodeValue)
			: undefined
	const blurValue = inversionFail && !isActiveInput

	return (
		<span
			className="targetInputOrValue"
			style={blurValue ? { filter: 'blur(3px)' } : {}}
		>
			{target.question ? (
				<>
					{!isActiveInput && <AnimatedTargetValue value={value} />}
					<CurrencyInput
						style={{
							color: colors.textColor,
							borderColor: colors.textColor
						}}
						debounce={600}
						name={target.dottedName}
						value={situationValue ? Math.round(situationValue) : value}
						className={
							isActiveInput || isNil(value) ? 'targetInput' : 'editableTarget'
						}
						onChange={evt =>
							dispatch(
								updateSituation(target.dottedName, Number(evt.target.value))
							)
						}
						onFocus={() => {
							if (isSmallTarget) return
							dispatch(setActiveTarget(target.dottedName))
						}}
						language={language}
					/>
					<span className="targetInputBottomBorder">
						{formatCurrency(value, language)}
					</span>
				</>
			) : (
				<span>
					{value && Number.isNaN(value) ? '—' : formatCurrency(value, language)}
				</span>
			)}
			{target.dottedName.includes('prix du travail') && <AidesGlimpse />}
			{target.dottedName === 'contrat salarié . rémunération . net' && (
				<TitreRestaurant />
			)}
		</span>
	)
}
function TitreRestaurant() {
	const titresRestaurant = useTarget(
		'contrat salarié . frais professionnels . titres-restaurant . montant'
	)
	const { language } = useTranslation().i18n
	if (!titresRestaurant?.nodeValue) return null
	return (
		<Animate.fromTop>
			<div className="aidesGlimpse">
				<RuleLink {...titresRestaurant}>
					+{' '}
					<strong>
						{formatCurrency(titresRestaurant.nodeValue, language)}
					</strong>{' '}
					<Trans>en titres-restaurant</Trans> {emoji(' 🍽')}
				</RuleLink>
			</div>
		</Animate.fromTop>
	)
}
function AidesGlimpse() {
	const aides = useTarget('contrat salarié . aides employeur')
	const { language } = useTranslation().i18n

	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aidesNode = aides?.explanation
	const aidesDetail = aides?.explanation.formule.explanation.explanation
	const aidesNotNul = aidesDetail?.filter(node => node.nodeValue !== false)
	const aideLink = aidesNotNul?.length === 1 ? aidesNotNul[0] : aidesNode

	if (!aides?.nodeValue) return null
	return (
		<Animate.fromTop>
			<div className="aidesGlimpse">
				<RuleLink {...aideLink}>
					<Trans>en incluant</Trans>{' '}
					<strong>
						<AnimatedTargetValue value={aides.nodeValue}>
							<span>{formatCurrency(aides.nodeValue, language)}</span>
						</AnimatedTargetValue>
					</strong>{' '}
					<Trans>d'aides</Trans> {emoji(aides.explanation?.icons ?? '')}
				</RuleLink>
			</div>
		</Animate.fromTop>
	)
}
