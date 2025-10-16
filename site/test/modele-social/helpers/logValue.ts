/* eslint-disable no-console */
import Engine from 'publicodes'

import { DottedName } from '@/domaine/publicodes/DottedName'

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
