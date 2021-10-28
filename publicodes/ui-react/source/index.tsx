import { utils } from 'publicodes'
import References from './rule/References'
export { default as Explanation } from './Explanation'
export { default as RulePage } from './rule/RulePage'
export { RuleLink } from './RuleLink'
export { References }

export function getDocumentationSiteMap({ engine, documentationPath }) {
	const parsedRules = engine.getParsedRules()
	return Object.fromEntries(
		Object.keys(parsedRules).map((dottedName) => [
			documentationPath + '/' + utils.encodeRuleName(dottedName),
			dottedName,
		])
	)
}
