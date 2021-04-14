import Engine, { utils } from 'publicodes'
import { Route } from 'react-router-dom'
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
	engine: Engine
	language: 'fr' | 'en'
	referenceImages?: Record<string, string>
}

export function Documentation({
	documentationPath,
	engine,
	referenceImages = {},
}: DocumentationProps) {
	return (
		<EngineContext.Provider value={engine}>
			<BasepathContext.Provider value={documentationPath}>
				<ReferencesImagesContext.Provider value={referenceImages}>
					<Route
						path={documentationPath + '/:name+'}
						render={({ match }) => {
							return (
								<RulePage
									dottedName={decodeRuleName(match.params.name)}
									engine={engine}
									language={'fr'}
								/>
							)
						}}
					/>
				</ReferencesImagesContext.Provider>
			</BasepathContext.Provider>
		</EngineContext.Provider>
	)
}

export function getDocumentationSiteMap({ engine, documentationPath }) {
	const parsedRules = engine.getParsedRules()
	return Object.fromEntries(
		Object.keys(parsedRules)
			// .filter(dottedName =>
			// 	ruleWithDedicatedDocumentationPage(parsedRules[dottedName])
			// )
			.map((dottedName) => [
				documentationPath + '/' + encodeRuleName(dottedName),
				dottedName,
			])
	)
}
