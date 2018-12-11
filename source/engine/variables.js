let formatBooleanValue = { oui: true, non: false }

export let getSituationValue = (situationGate, variableName, rule) => {
	// get the current situation value
	// it's the user input or test input, possibly with default values
	let value = situationGate(variableName)

	if (rule.API) return typeof value == 'string' ? JSON.parse(value) : value

	if (rule.format != null) return value
	//boolean variables don't have a format prop, it's the default
	if (formatBooleanValue[value] !== undefined) return formatBooleanValue[value]
	return value
}
