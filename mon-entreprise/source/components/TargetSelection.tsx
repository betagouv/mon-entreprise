import { updateSituation } from 'Actions/actions'
import classnames from 'classnames'
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
import { Fragment, useCallback, useContext, useState } from 'react'
import emoji from 'react-easy-emoji'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { RootState } from 'Reducers/rootReducer'
import {
	situationSelector,
	targetUnitSelector,
} from 'Selectors/simulationSelectors'
import InputSuggestions from './conversation/InputSuggestions'
import CurrencyInput from './CurrencyInput/CurrencyInput'
import './TargetSelection.css'

export default function TargetSelection({ showPeriodSwitch = true }) {
	const objectifs = useSelector(
		(state: RootState) => state.simulation?.config.objectifs || []
	)
	return (
		<div id="targetSelection">
			{(
				(typeof objectifs[0] === 'string'
					? [{ objectifs }]
					: objectifs) as Array<{
					icône?: string
					nom?: string
					objectifs: Array<DottedName>
				}>
			).map(({ icône, objectifs: targets, nom }, index: number) => (
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
						css={`
							margin-top: 0.6rem;
						`}
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
	const target: TargetType = { ...evaluation, ...rule.rawNode, ...rule }
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
						{isSmallTarget && <span className="guide-lecture" />}
						<TargetInputOrValue
							{...{
								target,
								isSmallTarget,
							}}
						/>
					</div>
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
	isSmallTarget: boolean
}

function TargetInputOrValue({
	target,
	isSmallTarget,
}: TargetInputOrValueProps) {
	const { language } = useTranslation().i18n
	const colors = useContext(ThemeColorsContext)
	const dispatch = useDispatch()
	const [isFocused, setFocused] = useState(false)
	const targetUnit = useSelector(targetUnitSelector)
	const engine = useContext(EngineContext)
	const situation = useSelector(situationSelector)
	const value =
		(engine.evaluate({
			valeur: target.dottedName,
			unité: targetUnit,
			arrondi: 'oui',
		}).nodeValue as number) ?? undefined
	const blurValue = useInversionFail() && !isFocused
	const onSuggestionClick = useCallback(
		(value) => {
			dispatch(updateSituation(target.dottedName, value))
		},
		[target.dottedName, dispatch]
	)
	const isSituationEmpty = Object.keys(situation).length === 0
	const isActive = target.dottedName in situation
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
		<>
			<span
				className="targetInputOrValue"
				style={blurValue ? { filter: 'blur(3px)' } : {}}
			>
				{target.question ? (
					<>
						{!isFocused && <AnimatedTargetValue value={value} />}
						<CurrencyInput
							style={{
								color: colors.textColor,
								borderColor: colors.textColor,
							}}
							debounce={750}
							name={target.dottedName}
							value={value}
							className={classnames(
								isFocused ||
									isActive ||
									isSituationEmpty ||
									(target.question && isSmallTarget)
									? 'targetInput'
									: 'editableTarget',
								{ focused: isFocused }
							)}
							onChange={onChange}
							onFocus={() => {
								setFocused(true)
							}}
							onBlur={() => setTimeout(() => setFocused(false), 200)}
							language={language}
						/>
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
			{(isActive || isFocused) && (
				<div style={{ minWidth: '100%' }}>
					<Animate.fromTop>
						<div css="display: flex; justify-content: flex-end; margin-bottom: -0.4rem">
							<InputSuggestions
								suggestions={target.suggestions}
								onFirstClick={onSuggestionClick}
							/>
						</div>
					</Animate.fromTop>
				</div>
			)}
		</>
	)
}
function TitreRestaurant() {
	const targetUnit = useSelector(targetUnitSelector)
	const dottedName =
		'contrat salarié . frais professionnels . titres-restaurant . montant'
	return (
		<Condition expression={`${dottedName} > 0`}>
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
		<Condition expression={`${dottedName} > 0`}>
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
