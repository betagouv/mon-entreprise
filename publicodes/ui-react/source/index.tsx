import { utils } from 'publicodes'
export { default as Explanation } from './Explanation'
export { default as RulePage } from './rule/RulePage'
export { RuleLink } from './RuleLink'

export function getDocumentationSiteMap({ engine, documentationPath }) {
	const parsedRules = engine.getParsedRules()
	return Object.fromEntries(
		Object.keys(parsedRules).map((dottedName) => [
			documentationPath + '/' + utils.encodeRuleName(dottedName),
			dottedName,
		])
	)
}
