import { any, equals, pipe } from 'ramda'

export let val = node => node && node.nodeValue

export let undefOrTruthy = val => val == undefined || !!val

export let anyNull = any(
	pipe(
		val,
		equals(null)
	)
)
