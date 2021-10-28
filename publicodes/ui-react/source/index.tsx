import Engine, { utils } from 'publicodes'
import {
	BasepathContext,
	EngineContext,
	ReferencesImagesContext,
} from './contexts'
import References from './rule/References'
import RulePage from './rule/RulePage'
const { decodeRuleName, encodeRuleName } = utils
export { default as Explanation } from './Explanation'
export { RuleLink } from './RuleLink'
export { References }

type DocumentationProps = {
	documentationPath: string
	rulePath: string
	engine: Engine
	language: 'fr' | 'en'
	referenceImages?: Record<string, string>
}

export function RulePageWithContext({
	documentationPath,
	rulePath,
	engine,
	referenceImages = {},
}: DocumentationProps) {
	const currentEngineId = new URLSearchParams(window.location.search).get(
		'currentEngineId'
	)

	return (
		<EngineContext.Provider value={engine}>
			<BasepathContext.Provider value={documentationPath}>
				<ReferencesImagesContext.Provider value={referenceImages}>
					<RulePage
						dottedName={decodeRuleName(rulePath)}
						subEngineId={currentEngineId}
						language="fr"
					/>
				</ReferencesImagesContext.Provider>
			</BasepathContext.Provider>
		</EngineContext.Provider>
	)
}

export function getDocumentationSiteMap({ engine, documentationPath }) {
	const parsedRules = engine.getParsedRules()
	return Object.fromEntries(
		Object.keys(parsedRules).map((dottedName) => [
			documentationPath + '/' + encodeRuleName(dottedName),
			dottedName,
		])
	)
}
