import React, { useState } from 'react'
import { Trans } from 'react-i18next'
import Engine from '../..'
import { formatValue } from '../../format'
import { serializeUnit } from '../../units'
import { Markdown } from '../Markdown'
import { RuleLinkWithContext } from '../RuleLink'
import Algorithm from './Algorithm'
import RuleHeader from './Header'
import References from './References'
import RuleSource from './RuleSource'

// let LazySource = React.lazy(() => import('../../../../mon-entreprise/source/components/RuleSource'))

export default function Rule({
	dottedName,
	useDefaultValues,
	engine,
	language
}) {
	const [viewSource, setViewSource] = useState(false)
	if (!engine.getParsedRules()[dottedName]) {
		return <p>Cette règle est introuvable dans la base</p>
	}
	const rule = engine.evaluate(dottedName, {
		useDefaultValues
	})
	const { description, question } = rule

	return (
		<div id="documentationRuleRoot">
			<RuleHeader dottedName={dottedName} />
			<section>
				<Markdown source={description || question} />
			</section>

			{(rule.nodeValue || rule.defaultValue || rule.unit) && (
				<>
					<p
						className="ui__ lead card light-bg"
						style={{
							display: 'inline-block',
							padding: '1rem'
						}}
					>
						{rule.nodeValue != null && (
							<>
								{formatValue(rule, { language })}
								<br />
							</>
						)}
						{rule.defaultValue?.nodeValue != null && (
							<>
								<small>
									Valeur par défaut :{' '}
									{formatValue(rule.defaultValue, {
										language
									})}
								</small>
								<br />
							</>
						)}
						{rule.nodeValue == null && !rule.defaultValue?.unit && rule.unit && (
							<>
								<small>Unité : {serializeUnit(rule.unit)}</small>
							</>
						)}
					</p>
				</>
			)}

			<Algorithm rule={rule} />
			<RuleSource key={dottedName} dottedName={dottedName} engine={engine} />
			{rule['rend non applicable'] && (
				<>
					<h2>
						<Trans>Rend non applicable les règles suivantes</Trans> :{' '}
					</h2>
					<ul>
						{rule['rend non applicable'].map(ruleName => (
							<li key={ruleName}>
								<RuleLinkWithContext dottedName={ruleName} />
							</li>
						))}
					</ul>
				</>
			)}
			{rule.note && (
				<>
					<h3>Note</h3>
					<div className="ui__ notice">
						<Markdown source={rule.note} />
					</div>
				</>
			)}
			{rule.références && (
				<>
					<h2>
						<Trans>Références</Trans>
					</h2>
					<References refs={rule.références} />
				</>
			)}
			{/* <Examples
					currentExample={currentExample}
					rule={rule}
					setCurrentExample={setCurrentExample}
				/> */}

			<AssociatedRules dottedName={dottedName} engine={engine} />
		</div>
	)
}

function AssociatedRules<Name extends string>({
	dottedName,
	engine
}: {
	dottedName: Name
	engine: Engine<Name>
}) {
	const namespaceRules = Object.keys(engine.getParsedRules()).filter(
		ruleDottedName =>
			ruleDottedName.startsWith(dottedName) &&
			ruleDottedName.split(' . ').length === dottedName.split(' . ').length + 1
	)
	if (!namespaceRules.length) {
		return null
	}
	return (
		<section>
			<h2>
				<Trans>Pages associées</Trans>
			</h2>
			<ul>
				{namespaceRules.map(dottedName => (
					<li key={dottedName}>
						<RuleLinkWithContext dottedName={dottedName} />
					</li>
				))}
			</ul>
		</section>
	)
}
