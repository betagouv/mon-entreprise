import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import Engine from '..'
import i18n from '../i18n'
import {
	decodeRuleName,
	encodeRuleName,
	ruleWithDedicatedDocumentationPage
} from '../ruleUtils'
import { BasepathContext, EngineContext } from './contexts'
import RulePage from './rule/Rule'

export { RuleLink } from './RuleLink'
import References from './rule/References'
export { References }

type DocumentationProps = {
	documentationPath: string
	engine: Engine
	language: 'fr' | 'en'
}

export function Documentation({
	documentationPath,
	engine,
	language = 'fr'
}: DocumentationProps) {
	useEffect(() => {
		if (language !== i18n.language) {
			i18n.changeLanguage(language)
		}
	}, [language])
	return (
		<EngineContext.Provider value={engine}>
			<BasepathContext.Provider value={documentationPath}>
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
			.map(dottedName => [
				documentationPath + '/' + encodeRuleName(dottedName),
				dottedName
			])
	)
}
