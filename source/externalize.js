var yaml = require('js-yaml')
var fs = require('fs')

rules = yaml.safeLoad(fs.readFileSync('source/règles/base.yaml','utf-8'))

externalized = rules.map(
	rule => {
		let externalizeProp = (rule, prop, result) => {
			if (rule[prop]) {
				result[prop+".fr"] = result[prop+".en"] = rule[prop]
			}
		}

		// Toujours traduire le nom via titre
		if (!rule["titre"]) rule["titre"] = rule["nom"]

		var result = {
			"cible": rule.espace ?
			rule.espace + " . " + rule.nom :
			rule.nom
		}
		externalizeProp(rule,"titre",result)
		externalizeProp(rule,"description",result)
		externalizeProp(rule,"question",result)
		externalizeProp(rule,"sous-question",result)
		externalizeProp(rule,"alias",result)
		return result
	}
)

fs.writeFileSync('externalized.yam', yaml.safeDump(externalized))
