import yaml from 'yaml'
import Engine, { formatValue, reduceAST, utils } from 'publicodes'
const { encodeRuleName } = utils

const getParents = (dottedName: string) =>
	dottedName
		.split(' . ')
		.map((_name, i, parts) => parts.slice(0, i + 1).join(' . '))

function getDependancies(engine: Engine, dottedName: string): Array<string> {
	const rule = engine.evaluate(engine.getRule(dottedName))

	return reduceAST<Array<string>>(
		(acc, node, fn) => {
			if (node.nodeKind === 'reference') {
				if (
					node.dottedName === rule.dottedName + ' . ' + node.name &&
					engine.getRule(node.dottedName).virtualRule
				) {
					return [...acc, ...getDependancies(engine, node.dottedName)]
				} else {
					return [...acc, ...getParents(node.dottedName as string)]
				}
			}
			if (node.nodeKind === 'variations' && typeof node.rawNode === 'string') {
				// We don't take replacement into account
				const originNode = node.explanation.slice(-1)[0].consequence
				return [...acc, ...fn(originNode)]
			}
		},
		[],
		rule.explanation.valeur
	)
}
type Props = { dottedName: string; engine: Engine }
export default function RuleSource({ engine, dottedName }: Props) {
	const dependancies = [
		...getDependancies(engine, dottedName),
		...getParents(dottedName),
	]
	const rule = engine.evaluate(engine.getRule(dottedName))

	// When we import a rule in the Publicodes Studio, we need to provide a
	// simplified definition of its dependencies to avoid undefined references.
	const dependenciesValues = Object.fromEntries(
		dependancies
			.filter((name) => name !== dottedName)
			.map((dottedName) => [
				dottedName,
				formatValueForStudio(engine.evaluate(engine.getRule(dottedName))),
			])
	)

	const source =
		`
# Ci-dessous la règle d'origine, écrite en publicodes.

# Publicodes est un langage déclaratif développé par l'Urssaf
# en partenariat avec beta.gouv.fr pour encoder les algorithmes d'intérêt public.

# Vous pouvez modifier les valeurs directement dans l'éditeur pour voir les calculs
# s'actualiser en temps réel
` +
		yaml
			.stringify({
				[dottedName]: Object.fromEntries(
					Object.entries(rule.rawNode).filter(([key]) => key !== 'nom')
				),
			})
			.replace(`${dottedName}:`, `\n${dottedName}:`) +
		'\n\n# Situation :\n' +
		yaml.stringify(dependenciesValues).split('\n').sort().join('\n')

	// For clarity add a break line before the main rule

	const baseURL =
		location.hostname === 'localhost' ? '/publicodes' : 'https://publi.codes'
	return (
		<div style={{ textAlign: 'right' }}>
			<a
				className="ui__ simple small button"
				target="_blank"
				href={`${baseURL}/studio/${encodeRuleName(
					dottedName
				)}?code=${encodeURIComponent(source)}`}
			>
				✍️ Voir la règle dans le bac à sable Publicodes
			</a>
		</div>
	)
}
// TODO: This formating function should be in the core code. We need to think
// about the different options of the formatting options and our use cases
// (putting a value in the URL #1169, importing a value in the Studio, showing a value
// on screen)
function formatValueForStudio(node: Parameters<typeof formatValue>[0]) {
	const base = formatValue(node)
		.replace(/\s\/\s/g, '/')
		.replace(/(\d)\s(\d)/g, '$1$2')
		.replace(',', '.')
	if (base.match(/^[0-9]/) || base === 'Oui' || base === 'Non') {
		return base.toLowerCase()
	} else if (base === '-') {
		return 'non'
	} else {
		return `'${base}'`
	}
}
