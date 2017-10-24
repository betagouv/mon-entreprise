import R from 'ramda'

export let val = node => node && node.nodeValue

export let undefOrTrue = val => val == undefined || val == true

export let anyNull = R.any(R.pipe(val, R.equals(null)))

export let applyOrEmpty = func => v => v ? func(v) : []
