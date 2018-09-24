// This file exports the functions of the public computing library
import { analyseMany, parseAll } from './traverse.js'
import { rulesFr, collectDefaults, nestedSituationToPathMap } from './rules'

let parsedRules = parseAll(rulesFr)

// The public evaluation function takes a nested object of input values
let nestedSituationToStateSelector = nestedSituation => dottedName =>
	({
		...collectDefaults(rulesFr),
		...nestedSituationToPathMap(nestedSituation)
	}[dottedName])

export default {
	eval: (targetNames, nestedSituation) =>
		analyseMany(parsedRules, targetNames)(
			nestedSituationToStateSelector(nestedSituation)
		),
	a: () => 7
}
