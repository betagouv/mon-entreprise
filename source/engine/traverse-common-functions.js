import { any, pipe, equals } from 'ramda'

export let val = node => node && node.value

export let undefOrTrue = val => val == undefined || val == true

export let anyNull = any(pipe(val, equals(null)))
