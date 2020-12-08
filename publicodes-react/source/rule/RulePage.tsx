import React from 'react'
import { Trans } from 'react-i18next'
import Engine, {
	formatValue,
	utils,
	serializeUnit,
	simplifyNodeUnit,
} from 'publicodes'
import Explanation from '../Explanation'
import {} from 'publicodes'
import { Markdown } from '../Markdown'
import { RuleLinkWithContext } from '../RuleLink'
import RuleHeader from './Header'
import References from './References'
import RuleSource from './RuleSource'

export default function Rule({ dottedName, engine, language }) {
	if (!engine.getParsedRules()[dottedName]) {
		return <p>Cette règle est introuvable dans la base</p>
	}
	const rule = engine.evaluateNode(engine.getParsedRules()[dottedName])
	// TODO affichage inline vs page

	const { description, question } = rule.rawNode
	const { parent, valeur } = rule.explanation
	return (
		<div id="documentationRuleRoot">
			<RuleHeader dottedName={dottedName} />
			<section>
				<Markdown source={description || question} />
			</section>

			{(rule.nodeValue || rule.unit) && (
				<>
					<p
						className="ui__ lead card light-bg"
						style={{
							display: 'inline-block',
							padding: '1rem',
						}}
					>
						{formatValue(simplifyNodeUnit(rule), { language })}
						<br />

						{rule.nodeValue == null && rule.unit && (
							<small>Unité : {serializeUnit(rule.unit)}</small>
						)}
					</p>
				</>
			)}

			{parent && 'nodeValue' in parent && parent.nodeValue === false && (
				<>
					<h3>Parent non applicable</h3>
					<p>
						Cette règle est non applicable car <Explanation node={parent} />
						est non applicable.
					</p>
				</>
			)}

			<h2>Comment cette donnée est-elle calculée ?</h2>
			<Explanation node={valeur} />

			<RuleSource key={dottedName} dottedName={dottedName} engine={engine} />
			{!!rule.replacements.length && (
				<>
					<h3>Effets </h3>
					<ul>
						{rule.replacements.map((replacement) => (
							<li key={replacement.replacedReference.dottedName}>
								<Explanation node={replacement} />
							</li>
						))}
					</ul>
				</>
			)}
			{rule.rawNode.note && (
				<>
					<h3>Note</h3>
					<div className="ui__ notice">
						<Markdown source={rule.rawNode.note} />
					</div>
				</>
			)}
			{rule.rawNode.références && (
				<>
					<h2>
						<Trans>Références</Trans>
					</h2>
					<References refs={rule.rawNode.références} />
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

function AssociatedRules({
	dottedName,
	engine,
}: {
	dottedName: string
	engine: Engine
}) {
	const namespaceRules = Object.keys(engine.getParsedRules())
		.filter(
			(ruleDottedName) =>
				ruleDottedName.startsWith(dottedName) &&
				ruleDottedName.split(' . ').length ===
					dottedName.split(' . ').length + 1
		)
		.filter((rule) => utils.ruleWithDedicatedDocumentationPage(rule))
	if (!namespaceRules.length) {
		return null
	}
	return (
		<section>
			<h2>
				<Trans>Pages associées</Trans>
			</h2>
			<ul>
				{namespaceRules.map((dottedName) => (
					<li key={dottedName}>
						<RuleLinkWithContext dottedName={dottedName} />
					</li>
				))}
			</ul>
		</section>
	)
}
