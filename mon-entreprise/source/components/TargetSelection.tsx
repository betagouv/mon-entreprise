import { setActiveTarget, updateSituation } from 'Actions/actions'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import Animate from 'Components/ui/animate'
import AnimatedTargetValue from 'Components/ui/AnimatedTargetValue'
import { ThemeColorsContext } from 'Components/utils/colors'
import {
	EngineContext,
	useEvaluation,
	useInversionFail
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { EvaluatedNode } from 'publicodes'
import { EvaluatedRule, formatValue } from 'publicodes'
import { isNil } from 'ramda'
import { Fragment, useCallback, useContext } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import { DottedName, ParsedRule } from 'Rules'
import {
	situationSelector,
	targetUnitSelector
} from 'Selectors/simulationSelectors'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default function TargetSelection({ showPeriodSwitch = true }) {
	const objectifs = useSelector(
		(state: RootState) => state.simulation?.config.objectifs || []
	)
	const colors = useContext(ThemeColorsContext)

	return (
		<div id="targetSelection">
			{((typeof objectifs[0] === 'string'
				? [{ objectifs }]
				: objectifs) as Array<{
				icône?: string
				nom?: string
				objectifs: Array<DottedName>
			}>).map(({ icône, objectifs: targets, nom }, index: number) => (
				<Fragment key={nom || '0'}>
					<div style={{ display: 'flex', alignItems: 'end' }}>
						<div style={{ flex: 1 }}>
							{nom && (
								<h2 style={{ marginBottom: 0 }}>
									{!!icône && emoji(icône)} <Trans>{nom}</Trans>
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
						<ul className="targets">
							{' '}
							{targets.map(target => (
								<Target key={target} dottedName={target} />
							))}
						</ul>
					</section>
				</Fragment>
			))}
		</div>
	)
}

type TargetProps = {
	dottedName: DottedName
}
const Target = ({ dottedName }: TargetProps) => {
	const activeInput = useSelector((state: RootState) => state.activeTargetInput)
	const target = useEvaluation(dottedName, {
		unit: useSelector(targetUnitSelector)
	})
	const dispatch = useDispatch()
	const onSuggestionClick = useCallback(
		value => {
			dispatch(updateSituation(target.dottedName, value))
		},
		[target.dottedName, dispatch]
	)

	const isSmallTarget = !!target.question !== !!target.formule
	if (
		target.nodeValue === false ||
		(isSmallTarget && !target.question && !target.nodeValue)
	) {
		return null
	}
	const isActiveInput = activeInput === target.dottedName

	return (
		<li
			key={target.dottedName}
			className={isSmallTarget ? 'small-target' : undefined}
		>
			<Animate.appear unless={!isSmallTarget}>
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
							<div css="display: flex; justify-content: flex-end; margin-bottom: -0.4rem">
								<InputSuggestions
									suggestions={target.suggestions}
									onFirstClick={onSuggestionClick}
									unit={target.unit}
								/>
							</div>
						</Animate.fromTop>
					)}
				</div>
			</Animate.appear>
		</li>
	)
}

const Header = ({ target }: { target: ParsedRule }) => {
	const sitePaths = useContext(SitePathsContext)
	const { t } = useTranslation()
	const { pathname } = useLocation()
	// TODO : Super hacky, we want to amend one label in the covid simulator, but
	// because the label is fetched from the global state we have to do a hack
	// here based on the URL.
	const hackyShowPeriod = pathname === sitePaths.simulateurs['chômage-partiel']
	return (
		<span className="header">
			<span className="texts">
				<span className="optionTitle">
					<RuleLink dottedName={target.dottedName}>
						{target.title || target.name}
						{hackyShowPeriod && ' ' + t('mensuel')}
					</RuleLink>
				</span>
				<p className="ui__ notice">{target.summary}</p>
			</span>
		</span>
	)
}

type TargetInputOrValueProps = {
	target: EvaluatedRule<DottedName>
	isActiveInput: boolean
	isSmallTarget: boolean
}

function TargetInputOrValue({
	target,
	isActiveInput,
	isSmallTarget
}: TargetInputOrValueProps) {
	const { language } = useTranslation().i18n
	const colors = useContext(ThemeColorsContext)
	const dispatch = useDispatch()
	const situationValue = useSelector(situationSelector)[target.dottedName]
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const value =
		typeof situationValue === 'string'
			? Math.round(
					engine.evaluate(situationValue, { unit: targetUnit })
						.nodeValue as number
			  )
			: situationValue != null
			? situationValue
			: target?.nodeValue != null
			? Math.round(+target.nodeValue)
			: undefined
	const blurValue = useInversionFail() && !isActiveInput

	const onChange = useCallback(
		evt =>
			dispatch(
				updateSituation(target.dottedName, +evt.target.value + ' ' + targetUnit)
			),
		[targetUnit, target, dispatch]
	)
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
						debounce={750}
						name={target.dottedName}
						value={value}
						className={
							isActiveInput ||
							isNil(value) ||
							(target.question && isSmallTarget)
								? 'targetInput'
								: 'editableTarget'
						}
						onChange={onChange}
						onFocus={() => {
							if (isSmallTarget) return
							dispatch(setActiveTarget(target.dottedName))
						}}
						language={language}
					/>
					<span className="targetInputBottomBorder">
						{formatValue(value, { language, displayedUnit: '€' })}
					</span>
				</>
			) : (
				<span>
					{value && Number.isNaN(value) ? (
						'—'
					) : (
						<RuleLink dottedName={target.dottedName}>
							{formatValue(value, { displayedUnit: '€', language })}
						</RuleLink>
					)}
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
	const targetUnit = useSelector(targetUnitSelector)
	const titresRestaurant = useEvaluation(
		'contrat salarié . frais professionnels . titres-restaurant . montant',
		{ unit: targetUnit }
	)
	const { language } = useTranslation().i18n
	if (!titresRestaurant?.nodeValue) return null
	return (
		<Animate.fromTop>
			<div className="aidesGlimpse">
				<RuleLink dottedName={titresRestaurant.dottedName}>
					+{' '}
					<strong>
						{formatValue(titresRestaurant, {
							displayedUnit: '€',
							language
						})}
					</strong>{' '}
					<Trans>en titres-restaurant</Trans> {emoji(' 🍽')}
				</RuleLink>
			</div>
		</Animate.fromTop>
	)
}
function AidesGlimpse() {
	const targetUnit = useSelector(targetUnitSelector)
	const aides = useEvaluation('contrat salarié . aides employeur', {
		unit: targetUnit
	})
	const { language } = useTranslation().i18n

	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aidesDetail = aides?.formule.explanation.explanation
	const aidesNotNul = aidesDetail?.filter(
		(node: EvaluatedNode) => node.nodeValue !== false
	)
	const aideLink = aidesNotNul?.length === 1 ? aidesNotNul[0] : aides

	if (!aides?.nodeValue) return null
	return (
		<Animate.fromTop>
			<div className="aidesGlimpse">
				<RuleLink dottedName={aideLink.dottedName}>
					<Trans>en incluant</Trans>{' '}
					<strong>
						<span>
							{formatValue(aides, {
								displayedUnit: '€',
								language
							})}
						</span>
					</strong>{' '}
					<Trans>d'aides</Trans> {emoji(aides?.icons ?? '')}
				</RuleLink>
			</div>
		</Animate.fromTop>
	)
}
