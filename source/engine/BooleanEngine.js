/* @flow */
import satSolve from 'boolean-sat'

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
	isNegated = (variable: string): boolean => {
		return this.negatedVariables.indexOf(variable) !== -1
	}
	negate = (): Array<Clause> => {
		// De Morgan laws
		return [
			...this.variables.map(variable => new False(variable)),
			...this.negatedVariables.map(variable => new True(variable))
		]
	}
}

class OnePossibilityAmong extends BooleanRule {
	variables: Array<string>
	constructor(...variables: Array<string>) {
		super()
		this.variables = variables
	}
	toCnf = (): Array<Clause> => {
		return [
			...Array(this.variables.length)
				.fill(this.variables)
				.map(
					(variables: Array<string>, i: number) =>
						new Clause(
							[variables[i]],
							[...variables.slice(0, i), ...variables.slice(i + 1)]
						)
				),
			new Clause([], this.variables)
		]
	}
	getVariables = () => {
		return this.variables
	}
}

class True extends Clause {
	constructor(variable: string) {
		super([variable], [])
	}
}

class False extends Clause {
	constructor(variable: string) {
		super([], [variable])
	}
}

const booleanCorrelation = ({ s01, s00, s10, s11 }) => {
	return (
		(s11 * s00 - s01 * s10) /
		Math.sqrt((s10 + s11) * (s01 + s00) * (s11 + s01) * (s00 + s10))
	)
}

class Solution {
	solution: Clause
	clauses: Clause
	static computeCorrelation = (
		solutions: Array<Solution>,
		variable: string
	): Array<[string, number]> => {
		const booleanDependencies: {
			[string]: { s00: number, s11: number, s01: number, s10: number }
		} = solutions[0].getVariables().reduce(
			(acc, variable) => ({
				[variable]: { s00: 0, s11: 0, s10: 0, s01: 0 },
				...acc
			}),
			{}
		)
		solutions.forEach(solution =>
			solution.getVariables().forEach(variable2 => {
				const [value1, value2] = [variable, variable2].map(solution.getValue)
				if (value1 && value2) {
					booleanDependencies[variable2].s11 = +1
				}
				if (value1 && !value2) {
					booleanDependencies[variable2].s10 = +1
				}
				if (!value1 && value2) {
					booleanDependencies[variable2].s01 = +1
				}
				if (!value1 && !value2) {
					booleanDependencies[variable2].s00 = +1
				}
			})
		)

		return Object.entries(booleanDependencies).map(
			([variable, booleanDependency]) => [
				variable,
				// $FlowFixMe
				booleanCorrelation(booleanDependency)
			]
		)
	}
	constructor(clauses: Array<Clause>, excludedSolutions: Array<Solution> = []) {
		const variables = []
		const cnf = [
			...clauses,
			...excludedSolutions.map(solution => solution.negate())
		].map(clause =>
			clause.getVariables().map(variable => {
				const variableNumber: number = variables.indexOf(variable) + 1
				const isNegated = clause.isNegated(variable) ? -1 : 1
				if (variableNumber) {
					return isNegated * variableNumber
				}
				variables.push(variable)
				return isNegated * variables.length
			})
		)
		const solution = satSolve(variables.length, cnf)
		if (!solution) {
			return null
		}
		const falseVariables = []
		const trueVariables = []
		solution.forEach((value, index) => {
			;(value ? trueVariables : falseVariables).push(variables[index - 1])
		})
		this.solution = new Clause(trueVariables, falseVariables)
	}
	negate = (): Clause => {
		return this.solution
	}
	compatibleWith = (clause: Clause): Solution => {
		return new Solution([clause, ...this.solution.negate()])
	}
	getValue = (variable: string): boolean => {
		return this.solution.getVariables().indexOf(variable) === -1
			? null
			: !this.solution.isNegated(variable)
	}
	getVariables = () => {
		return this.solution.getVariables()
	}
}

class SatSolver {
	clauses: Array<Clause> = []
	solutions: Array<$ReadOnly<Solution>> = []
	addClause(clause: Clause) {
		this.clauses.push(clause)
		this.solutions = this.solutions
			.map(solution => solution.compatibleWith(clause))
			.filter(Boolean)
		if (!this.solutions.length) {
			this.solve()
		}
	}
	solve() {
		const solution = new Solution(this.clauses, this.solutions)
		if (solution) {
			this.solutions.push(solution)
		}
		this.throwIfNotSat()
		return solution
	}

	evaluate(variable: string): ?boolean {
		const isTrue = !!new Solution([...this.clauses, new True(variable)])
		const isFalse = !!new Solution([...this.clauses, new False(variable)])
		if (isTrue && isFalse) {
			return null
		}
		return isTrue
	}

	collectMissings(variable: string): Array<Boolean> {
		const correlations = Solution.computeCorrelation(this.solutions, variable)
		console.log(correlations)
	}
	throwIfNotSat = () => {
		if (!this.solutions.length) {
			throw new Error(
				'Impossibilité logique : les règles spécifiées ne sont pas compatibles entre elles'
			)
		}
	}
}

export default class BooleanEngine {
	rules: Array<BooleanRule> = []
	solver: SatSolver = new SatSolver()
	addRule = (rule: BooleanRule) => {
		this.rules.push(rule)
		rule.toCnf().forEach(clause => this.solver.addClause(clause))
	}
	// TODO : if not applicable, add possibility to remove rule
	evaluate = (variable: string) => {
		const evaluation = this.solver.evaluate(variable)
		if (evaluation === null) {
			return this.solver.collectMissings(variable)
		}
	}
}

export const Rules = {
	OnePossibilityAmong,
	True,
	False
}
