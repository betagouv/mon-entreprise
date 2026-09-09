/* eslint-disable no-console */
import { DottedName } from 'modele-social'
import Engine from 'publicodes'

export const logValue = (e: Engine, rule: DottedName) => {
	const result = e.evaluate(rule)

	const unit = result.unit?.denominators
		? `${result.unit?.numerators[0]}/-${result.unit?.denominators[0]}`
		: result.unit?.numerators
		? `${result.unit?.numerators[0]}`
		: ''

	console.log(`${rule} = ${result.nodeValue?.toString()} ${unit}`)
}

export const logApplicability = (e: Engine, rule: DottedName) => {
	const result = e.evaluate({ 'est applicable': rule })

	console.log(
		`${rule} ${result.nodeValue ? 'est applicable' : 'n’est pas applicable'}`
	)
}
