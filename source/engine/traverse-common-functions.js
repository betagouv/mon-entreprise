import R from 'ramda'

export let val = node => node.nodeValue

export let anyNull = R.any(R.pipe(val, R.equals(null)))
