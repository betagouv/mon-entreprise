import steps from './conversation-steps'

export default values =>
	values == null ? {} :
	Object.keys(values).reduce((final, next) => {
		let value = values[next],
			{valueType = {}, validator} = steps[next],
			{pre = (v => v), test, error} = Object.assign({}, validator, valueType.validator)
		if (!test) return final

		let valid = test(pre(value))

		return Object.assign(final, valid ? null : {[next]: error})
	}, {})
