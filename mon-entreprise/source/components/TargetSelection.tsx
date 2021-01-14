import { setActiveTarget, updateSituation } from 'Actions/actions'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import Value, { Condition } from 'Components/EngineValue'
import PeriodSwitch from 'Components/PeriodSwitch'
import RuleLink from 'Components/RuleLink'
import Animate from 'Components/ui/animate'
import AnimatedTargetValue from 'Components/ui/AnimatedTargetValue'
import { ThemeColorsContext } from 'Components/utils/colors'
import {
	EngineContext,
	useEngine,
	useInversionFail,
} from 'Components/utils/EngineContext'
import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { DottedName } from 'modele-social'
import { Names } from 'modele-social/dist/names'
import {
	ASTNode,
	EvaluatedNode,
	formatValue,
	reduceAST,
	RuleNode,
} from 'publicodes'
import { isNil } from 'ramda'
import { Fragment, useCallback, useContext, useEffect, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	firstStepCompletedSelector,
	situationSelector,
	targetUnitSelector,
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
								)`,
						}}
					>
						<ul className="targets">
							{' '}
							{targets.map((target) => (
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
type TargetType = EvaluatedNode &
	RuleNode['rawNode'] &
	RuleNode & { dottedName: DottedName }

const Target = ({ dottedName }: TargetProps) => {
	const engine = useEngine()
	const rule = engine.getRule(dottedName)
	const evaluation = engine.evaluate({
		valeur: dottedName,
		unité: useSelector(targetUnitSelector),
		arrondi: 'oui',
	})
	const situation = useSelector(situationSelector)

	const target: TargetType = { ...evaluation, ...rule.rawNode, ...rule }
	const dispatch = useDispatch()
	const onSuggestionClick = useCallback(
		(value) => {
			dispatch(updateSituation(dottedName, value))
		},
		[target.dottedName, dispatch]
	)
	const isActive =
		dottedName in situation || Object.keys(situation).length === 0

	const isSmallTarget =
		!rule.rawNode.question ||
		(dottedName in evaluation.missingVariables &&
			Object.keys(evaluation.missingVariables).length === 1)
	if (
		target.nodeValue === false ||
		(isSmallTarget && !target.question && !target.nodeValue)
	) {
		return null
	}
	return (
		<li
			key={target.dottedName}
			className={isSmallTarget ? 'small-target' : undefined}
		>
			<Animate.appear unless={!isSmallTarget}>
				<div>
					<div className="main">
						<Header target={target} />
						{isSmallTarget && (
							<span
								style={{
									flex: 1,
									borderBottom: '1px dashed #ffffff91',
									marginLeft: '1rem',
								}}
							/>
						)}

						<TargetInputOrValue
							{...{
								target,
								isActive,
								isSmallTarget,
							}}
						/>
					</div>
					{isActive && (
						<Animate.fromTop>
							<div css="display: flex; justify-content: flex-end; margin-bottom: -0.4rem">
								<InputSuggestions
									suggestions={target.suggestions}
									onFirstClick={onSuggestionClick}
								/>
							</div>
						</Animate.fromTop>
					)}
				</div>
			</Animate.appear>
		</li>
	)
}

const Header = ({ target }: { target: TargetType }) => {
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
						{target.title}
						{hackyShowPeriod && ' ' + t('mensuel')}
					</RuleLink>
				</span>
				<p className="ui__ notice">{target.résumé}</p>
			</span>
		</span>
	)
}

type TargetInputOrValueProps = {
	target: TargetType
	isActive: boolean
	isSmallTarget: boolean
}

function TargetInputOrValue({
	target,
	isActive,
	isSmallTarget,
}: TargetInputOrValueProps) {
	const { language } = useTranslation().i18n
	const colors = useContext(ThemeColorsContext)
	const dispatch = useDispatch()
	const [isActiveOrFocused, setActive] = useState(isActive)
	useEffect(() => setActive(isActive), [isActive])
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const value =
		(engine.evaluate({
			valeur: target.dottedName,
			unité: targetUnit,
			arrondi: 'oui',
		}).nodeValue as number) ?? undefined
	const blurValue = useInversionFail() && !isActiveOrFocused

	const onChange = useCallback(
		(evt) =>
			dispatch(
				updateSituation(target.dottedName, {
					valeur: evt.target.value,
					unité: targetUnit,
				})
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
					{!isActiveOrFocused && <AnimatedTargetValue value={value} />}
					<CurrencyInput
						style={{
							color: colors.textColor,
							borderColor: colors.textColor,
						}}
						debounce={750}
						name={target.dottedName}
						value={value}
						className={
							isActiveOrFocused ||
							isNil(value) ||
							(target.question && isSmallTarget)
								? 'targetInput'
								: 'editableTarget'
						}
						onChange={onChange}
						onFocus={() => {
							setActive(true)
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
	const dottedName =
		'contrat salarié . frais professionnels . titres-restaurant . montant'
	return (
		<Condition expression={dottedName}>
			<Animate.fromTop>
				<div className="aidesGlimpse">
					<RuleLink dottedName={dottedName}>
						+{' '}
						<strong>
							<Value
								expression={dottedName}
								displayedUnit="€"
								unit={targetUnit}
							/>
						</strong>{' '}
						<Trans>en titres-restaurant</Trans> {emoji(' 🍽')}
					</RuleLink>
				</div>
			</Animate.fromTop>
		</Condition>
	)
}
function AidesGlimpse() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName = 'contrat salarié . aides employeur' as Names
	const engine = useEngine()
	const aides = engine.getRule(dottedName)
	// Dans le cas où il n'y a qu'une seule aide à l'embauche qui s'applique, nous
	// faisons un lien direct vers cette aide, plutôt qu'un lien vers la liste qui
	// est une somme des aides qui sont toutes nulle sauf l'aide active.
	const aideLink = reduceAST(
		(acc, node) => {
			if (node.nodeKind === 'somme') {
				const aidesNotNul = node.explanation
					.map((n) => engine.evaluate(n))
					.filter(({ nodeValue }) => nodeValue !== false)
				if (aidesNotNul.length === 1) {
					return (aidesNotNul[0] as ASTNode & { nodeKind: 'reference' })
						.dottedName as DottedName
				} else {
					return acc
				}
			}
		},
		dottedName,
		aides
	)
	return (
		<Condition expression={dottedName}>
			<Animate.fromTop>
				<div className="aidesGlimpse">
					<RuleLink dottedName={aideLink}>
						<Trans>en incluant</Trans>{' '}
						<strong>
							<Value
								expression={dottedName}
								displayedUnit="€"
								unit={targetUnit}
							/>
						</strong>{' '}
						<Trans>d'aides</Trans> {emoji(aides.rawNode.icônes ?? '')}
					</RuleLink>
				</div>
			</Animate.fromTop>
		</Condition>
	)
}
