import React, { useEffect } from 'react'
import { Route } from 'react-router-dom'
import Engine from '..'
import i18n from '../i18n'
import { decodeRuleName, encodeRuleName } from '../ruleUtils'
import { BasepathContext, EngineContext } from './contexts'
import RulePage from './rule/Rule'

export { RuleLink } from './RuleLink'

type DocumentationProps<Names extends string> = {
	documentationPath: string
	engine: Engine<Names>
	language: 'fr' | 'en'
}

export function Documentation<Names extends string>({
	documentationPath,
	engine,
	language = 'fr'
}: DocumentationProps<Names>) {
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
	return Object.fromEntries(
		Object.keys(engine.getParsedRules()).map(dottedName => [
			documentationPath + '/' + encodeRuleName(dottedName),
			dottedName
		])
	)
}
