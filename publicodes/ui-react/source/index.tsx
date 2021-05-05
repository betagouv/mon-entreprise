import Engine, { utils } from 'publicodes'
import { useCallback, useRef } from 'react'
import { Route, useLocation } from 'react-router-dom'
import {
	BasepathContext,
	EngineContext,
	ReferencesImagesContext,
	RegisterEngineContext,
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

function useCacheEngineBySituation(
	defaultEngine: Engine,
	currentSituation?: Engine['parsedSituation']
) {
	const registeredEngines = useRef(
		new WeakMap().set(
			defaultEngine.parsedSituation,
			defaultEngine.shallowCopy()
		)
	)
	const registerEngine = useCallback(
		(engine: Engine) =>
			registeredEngines.current.set(
				engine.parsedSituation,
				engine.shallowCopy()
			),
		[registeredEngines]
	)
	if (currentSituation && !registeredEngines.current.has(currentSituation)) {
		registeredEngines.current.set(
			currentSituation,
			defaultEngine.shallowCopy().setSituation(currentSituation)
		)
	}
	const engine = currentSituation
		? registeredEngines.current.get(currentSituation)
		: defaultEngine
	return [engine, registerEngine]
}

export function Documentation({
	documentationPath,
	engine: defaultEngine,
	referenceImages = {},
}: DocumentationProps) {
	const { state } = useLocation<
		| {
				situation?: Engine['parsedSituation']
				situationName?: string
		  }
		| undefined
	>()
	const [engine, cacheEngine] = useCacheEngineBySituation(
		defaultEngine,
		state?.situation
	)
	return (
		<RegisterEngineContext.Provider value={cacheEngine}>
			<EngineContext.Provider value={engine}>
				<BasepathContext.Provider value={documentationPath}>
					<ReferencesImagesContext.Provider value={referenceImages}>
						<Route
							path={documentationPath + '/:name+'}
							render={({ match }) => {
								return (
									<RulePage
										situationName={state?.situationName}
										dottedName={decodeRuleName(match.params.name)}
										language={'fr'}
									/>
								)
							}}
						/>
					</ReferencesImagesContext.Provider>
				</BasepathContext.Provider>
			</EngineContext.Provider>
		</RegisterEngineContext.Provider>
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
