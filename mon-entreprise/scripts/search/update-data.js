require('dotenv').config()

const algoliasearch = require('algoliasearch')
const rules = require('modele-social')

const { ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY } = process.env

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)

const rulesIndex = client.initIndex('rules')

const formatRulesToAlgolia = (rules) => {
	const ruleNames = Object.keys(rules)
	return ruleNames
		.map((n) => {
			const rule = rules[n]
			if (rule) {
				const path = n.split(' . ')
				return {
					objectID: n,
					path,
					pathDepth: path.length,
					acronyme: rule.acronyme,
					titre: rule.titre,
					icone: rule.icônes,
					description: rule.description,
				}
			}
		})
		.filter((r) => Boolean(r))
}

;(async function () {
	try {
		await rulesIndex.clearObjects().wait()
		await rulesIndex.saveObjects(formatRulesToAlgolia(rules)).wait()
	} catch (e) {
		console.log(e)
	}
})()
