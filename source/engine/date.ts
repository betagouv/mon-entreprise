const dateRegexp = /[\d]{2}\/[\d]{2}\/[\d]{4}/

export function convertToDateIfNeeded(...values: string[]) {
	const dateStrings = values.map(dateString => '' + dateString)
	if (!dateStrings.some(dateString => dateString.match(dateRegexp))) {
		return values
	}
	dateStrings.forEach(dateString => {
		if (!dateString.match(dateRegexp)) {
			throw new TypeError(
				`L'opérande '${dateString}' n'est pas une date valide`
			)
		}
	})
	return dateStrings
		.map(date => date.split('/'))
		.map(([jour, mois, année]) => new Date(+année, +mois - 1, +jour))
}
