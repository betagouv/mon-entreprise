/* @flow */

class BooleanRule {
	getVariables = (): Array<string> => {
		throw new Error('Abstract method')
	}
	toCnf = (): Array<Clause> => {
		throw new Error('Abstract method')
	}
}

class Clause extends BooleanRule {
	variables: Array<string> = []
	negatedVariables: Array<string> = []
	constructor(variables: Array<string>, negatedVariables: Array<string>) {
		super()
		this.variables = variables
		this.negatedVariables = negatedVariables
	}
	getVariables = (): Array<string> => {
		return this.variables.concat(this.negatedVariables)
	}
	toCnf = (): Array<Clause> => {
		return [this]
	}
}

class OnePossibilityAmong extends BooleanRule {
	variables: Array<string>
	constructor(...variables: Array<string>) {
		super()
		this.variables = variables
	}
	toCnf = (): Array<Clause> => {
		return Array(this.variables.length)
			.fill(this.variables)
			.map(
				(variables: Array<string>, i: number) =>
					new Clause(
						[variables[i]],
						[...variables.slice(0, i), ...variables.slice(i + 1)]
					)
			)
	}
	getVariables = () => {
		return this.variables
	}
}
class True extends Clause {
	constructor(variable: string) {
		super([variable])
	}
}

class False extends Clause {
	constructor(variable: string) {
		super([], [variable])
	}
}

class Evaluation {
	cnfMap: { [string]: number }
	constructor(rules: Array<BooleanRule>) {
		this.cnfMap = rules
			.map(rule => rule.getVariables())
			.reduce((acc, variables) => acc.concat(variables), [])
			.reduce(
				({ cnfMap, currentIndex }, variable) => {
					if (cnfMap[variable]) {
						return { cnfMap, currentIndex }
					}
					return {
						cnfMap: { [variable]: currentIndex },
						currentIndex: currentIndex + 1
					}
				},
				{ cnfMap: {}, currentIndex: 0 }
			).cnfMap
	}
}

export default class BooleanEngine {
	rules: Array<BooleanRule>
	addRule = (rule: BooleanRule) => {
		this.rules.push(rule)
	}
	// TODO : if not applicable, remove rule
	evaluate = variable => {
		evaluate(this.rules)
	}
}

export const Rules = {
	OnePossibilityAmong,
	True,
	False
}
