import { DottedName } from 'modele-social'
import Engine from 'publicodes'

export const logValue = (e: Engine, rule: DottedName) => {
	const result = e.evaluate(rule)
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	const unit = `${result.unit?.numerators}/${result.unit?.denominators}`
	// eslint-disable-next-line no-console,@typescript-eslint/restrict-template-expressions
	console.log(`${rule} = ${result.nodeValue} ${unit}`)
}
