export let capitalise0 = name => name[0].toUpperCase() + name.slice(1)

export let getUrl = () => window.location.href.toString()
export let getIframeOption = optionName => {
	let url = getUrl(),
		hasOption = url.includes(optionName + '=')
	return hasOption && url.split(optionName + '=')[1].split('&')[0]
}

export let fmt =
	'Intl' in window ? new Intl.NumberFormat('fr-FR').format : v => v

export let humanFigure = decimalDigits => value =>
	fmt(value.toFixed(decimalDigits))
