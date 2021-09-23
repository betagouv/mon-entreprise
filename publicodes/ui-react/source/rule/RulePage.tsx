import Engine, {
	formatValue,
	serializeUnit,
	simplifyNodeUnit,
	utils,
} from 'publicodes'
import { isEmpty } from 'ramda'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { EngineContext } from '../contexts'
import Explanation from '../Explanation'
import { Markdown } from '../Markdown'
import { RuleLinkWithContext } from '../RuleLink'
import RuleHeader from './Header'
import References from './References'
import RuleSource from './RuleSource'

export default function Rule({ dottedName, language, situationName }) {
	const engine = useContext(EngineContext)
	const { pathname } = useLocation()

	if (!engine) {
		throw new Error('Engine expected')
	}
	if (!(dottedName in engine.getParsedRules())) {
		return <p>Cette règle est introuvable dans la base</p>
	}
	const rule = engine.evaluate(engine.getRule(dottedName))
	const { description, question } = rule.rawNode
	const { parent, valeur } = rule.explanation
	return (
		<div id="documentationRuleRoot">
			{situationName && (
				<div
					className="ui__ card notice light-bg"
					style={{
						display: 'flex',
						alignItems: 'baseline',
						flexWrap: 'wrap',
						margin: '1rem 0',
						paddingTop: '0.4rem',
						paddingBottom: '0.4rem',
					}}
				>
					<div>
						Vous explorez la documentation avec le contexte{' '}
						<strong className="ui__ label">{situationName}</strong>{' '}
					</div>
					<div style={{ flex: 1 }} />
					<div>
						<Link to={pathname}>Retourner à la version de base</Link>
					</div>
				</div>
			)}
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

			{!isEmpty(rule.missingVariables) && (
				<>
					<h3>Données manquantes</h3>
					<p className="ui__ notice">
						Les règles suivantes sont nécessaires pour le calcul mais n'ont pas
						été saisies dans la situation. Leur valeur par défaut est utilisée.
					</p>

					<ul>
						{Object.keys(rule.missingVariables).map((dottedName) => (
							<li key={dottedName}>
								<RuleLinkWithContext dottedName={dottedName} />
							</li>
						))}
					</ul>
				</>
			)}
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
					<h2>Références</h2>
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
			<h2>Pages associées</h2>
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
