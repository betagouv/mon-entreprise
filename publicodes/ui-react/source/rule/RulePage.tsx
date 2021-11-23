import Engine, {
	formatValue,
	isNotYetDefined,
	serializeUnit,
	simplifyNodeUnit,
	utils,
	EvaluatedNode,
} from 'publicodes'
import { decodeRuleName } from 'publicodes/source/ruleUtils'
import { useContext, useEffect, useState } from 'react'
import {
	BasepathContext,
	EngineContext,
	RenderersContext,
	SupportedRenderers,
} from '../contexts'
import Explanation from '../Explanation'
import { Markdown } from '../Markdown'
import { RuleLinkWithContext } from '../RuleLink'
import RuleHeader from './Header'
import RuleSource from './RuleSource'

type RulePageProps = {
	documentationPath: string
	rulePath: string
	engine: Engine
	language: 'fr' | 'en'
	renderers: SupportedRenderers
}

export default function RulePage({
	documentationPath,
	rulePath,
	engine,
	renderers,
	language,
}: RulePageProps) {
	const currentEngineId = new URLSearchParams(window.location.search).get(
		'currentEngineId'
	)

	return (
		<EngineContext.Provider value={engine}>
			<BasepathContext.Provider value={documentationPath}>
				<RenderersContext.Provider value={renderers}>
					<Rule
						dottedName={decodeRuleName(rulePath)}
						subEngineId={
							currentEngineId ? parseInt(currentEngineId) : undefined
						}
						language={language}
					/>
				</RenderersContext.Provider>
			</BasepathContext.Provider>
		</EngineContext.Provider>
	)
}

type RuleProps = {
	dottedName: string
	subEngineId?: number
	language: RulePageProps['language']
}

export function Rule({ dottedName, language, subEngineId }: RuleProps) {
	const baseEngine = useContext(EngineContext)
	const { References } = useContext(RenderersContext)
	if (!baseEngine) {
		throw new Error('Engine expected')
	}

	const useSubEngine =
		subEngineId && baseEngine.subEngines.length >= subEngineId

	const engine = useSubEngine
		? baseEngine.subEngines[subEngineId as number]
		: baseEngine

	if (!(dottedName in engine.getParsedRules())) {
		return <p>Cette règle est introuvable dans la base</p>
	}
	const rule = engine.evaluate(engine.getRule(dottedName)) as EvaluatedNode & {
		nodeKind: 'rule'
	}
	const { description, question } = rule.rawNode
	const { parent, valeur } = rule.explanation
	console.debug(`Rule ${rule.dottedName} value: ${rule.nodeValue}`)
	console.debug(
		`Rule ${rule.dottedName} missingVariables: ${JSON.stringify(
			rule.missingVariables
		)}`
	)
	return (
		<div id="documentationRuleRoot">
			{useSubEngine && (
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
						<strong className="ui__ label">mécanisme recalcul</strong>
					</div>
					<div style={{ flex: 1 }} />
					<div>
						<RuleLinkWithContext dottedName={dottedName} useSubEngine={false}>
							Retourner à la version de base
						</RuleLinkWithContext>
					</div>
				</div>
			)}
			<RuleHeader dottedName={dottedName} />
			<section>
				<Markdown source={description || question} />
			</section>
			{
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
						{isNotYetDefined(rule.nodeValue) && rule.unit && (
							<small>Unité : {serializeUnit(rule.unit)}</small>
						)}
					</p>
				</>
			}
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

			{rule.missing &&
				((rule.missing.self && rule.missing.self.length > 0) ||
					(rule.missing.parent && rule.missing.parent.length > 0)) && (
					<MissingVars
						dottedName={dottedName}
						selfMissing={rule.missing.self}
						parentMissing={rule.missing.parent}
					/>
				)}

			{isNotYetDefined(rule.nodeValue) && (
				<ReverseMissing dottedName={dottedName} engine={engine} />
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

			<NamespaceChildrenRules dottedName={dottedName} engine={engine} />

			{rule.rawNode.note && (
				<>
					<h3>Note</h3>
					<div className="ui__ notice">
						<Markdown source={rule.rawNode.note} />
					</div>
				</>
			)}
			{rule.rawNode.références && References && (
				<>
					<h3>Références</h3>
					<References references={rule.rawNode.références} />
				</>
			)}
		</div>
	)
}
function MissingVars({
	dottedName,
	selfMissing,
	parentMissing,
}: {
	dottedName: string
	selfMissing: string[] | null
	parentMissing: string[] | null
}) {
	const [opened, setOpened] = useState(false)
	useEffect(() => {
		setOpened(false)
	}, [dottedName])

	return (
		<>
			<span>
				<h3 style={{ display: 'inline-block', marginRight: '1rem' }}>
					Données manquantes
				</h3>
				<a
					className="ui__ simple small button"
					onClick={() => {
						setOpened(!opened)
					}}
				>
					{opened ? 'cacher' : 'voir'}
				</a>
			</span>
			<p className="ui__ notice">
				Les règles suivantes sont nécessaires pour le calcul mais n'ont pas été
				saisies dans la situation. Leur valeur par défaut est utilisée.
			</p>
			{opened && (
				<>
					{selfMissing && selfMissing.length > 0 && (
						<>
							<ul>
								{selfMissing.map((dottedName) => (
									<li key={dottedName}>
										<RuleLinkWithContext dottedName={dottedName} />
									</li>
								))}
							</ul>
						</>
					)}
					{parentMissing && parentMissing.length > 0 && (
						<>
							<h4>… dont celles provenant du parent</h4>
							<ul>
								{parentMissing.map((dottedName) => (
									<li key={dottedName}>
										<RuleLinkWithContext dottedName={dottedName} />
									</li>
								))}
							</ul>
						</>
					)}
				</>
			)}
		</>
	)
}

function ReverseMissing({
	dottedName,
	engine,
}: {
	dottedName: string
	engine: Engine
}) {
	const [opened, setOpened] = useState(false)
	useEffect(() => {
		setOpened(false)
	}, [dottedName])

	const getRuleNamesWithMissing = () =>
		Object.keys(engine.getParsedRules()).filter((ruleName) => {
			const evaluation = engine.evaluate(engine.getRule(ruleName))
			return evaluation.missing?.self?.includes(dottedName)
		})

	return (
		<section>
			<span>
				<h3 style={{ display: 'inline-block', marginRight: '1rem' }}>
					Autres règles qui auraient besoin de cette valeur
				</h3>
				<a
					className="ui__ simple small button"
					onClick={() => {
						setOpened(!opened)
					}}
				>
					{opened ? 'cacher' : 'voir'}
				</a>
			</span>
			<p className="ui__ notice">
				Les règles suivantes ont besoin de la règle courante pour être
				calculées. Or, la règle courante n'étant pas encore définie, c'est sa
				valeur par défaut qui est utilisée pour déterminer la valeur de ces
				règles.
			</p>

			{opened && (
				<>
					<ul>
						{(() => {
							const ruleNamesWithMissing = getRuleNamesWithMissing()
							return ruleNamesWithMissing.length
								? ruleNamesWithMissing.map((dottedName) => (
										<li key={dottedName}>
											<RuleLinkWithContext dottedName={dottedName} />
										</li>
								  ))
								: 'Aucune autre règle ne dépend de la règle courante.'
						})()}
					</ul>
				</>
			)}
		</section>
	)
}

function NamespaceChildrenRules({
	dottedName,
	engine,
}: {
	dottedName: string
	engine: Engine
}) {
	const namespaceChildrenRules = Object.keys(engine.getParsedRules())
		.filter(
			(ruleDottedName) =>
				ruleDottedName.startsWith(dottedName) &&
				ruleDottedName.split(' . ').length ===
					dottedName.split(' . ').length + 1
		)
		.filter((rule) => utils.ruleWithDedicatedDocumentationPage(rule))
	if (!namespaceChildrenRules.length) {
		return null
	}
	return (
		<section>
			<h2>Règles enfants </h2>
			<ul>
				{namespaceChildrenRules.map((dottedName) => (
					<li key={dottedName}>
						<RuleLinkWithContext dottedName={dottedName} />
					</li>
				))}
			</ul>
		</section>
	)
}
