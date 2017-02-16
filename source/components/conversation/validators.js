// Regexps used to validate processed user inputs

export let number = {
	pre: v =>
		v.replace(/,/g, '.') // commas -> dots
		.replace(/\s/g, ''), // remove spaces
	test: v => /^[0-9]+(\.[0-9]+)?$/.test(v),
	error: 'Vous devez entrer un nombre',
}

export let int = {
	test: v => /^[0-9]+/.test(v),
	error: 'Vous devez entrer un entier, par ex. 16'
}
