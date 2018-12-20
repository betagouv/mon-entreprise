/* @flow */
import satSolve from 'boolean-sat'

class BooleanRule {
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
	toString = (): string => {
		return [
			this.variables.join(', '),
			this.negatedVariables.map(x => 'not ' + x).join(', ')
		].join(', ')
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

class Or extends Clause {
	constructor(...variables: Array<string>) {
		super(variables, [])
	}
}

const booleanCorrelation = ({ s01, s00, s10, s11 }) => {
	console.log(s01, s00, s10, s11)
	return (
		(s11 * s00 - s01 * s10) /
		Math.sqrt((s10 + s11) * (s01 + s00) * (s11 + s01) * (s00 + s10))
	)
}

class Solution {
	solution: Clause
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
		// console.log(cnf, solution)
		if (!solution) {
			return null
		}
		const falseVariables = []
		const trueVariables = []
		solution.slice(1).forEach((value, index) => {
			;(value ? trueVariables : falseVariables).push(variables[index])
		})
		this.solution = new Clause(trueVariables, falseVariables)
	}
	negate = (): Clause => {
		return this.solution
	}
	addClause = (clause: Clause): Solution => {
		if (!this.exists()) {
			return this
		}
		return new Solution([clause, ...this.solution.negate()])
	}
	getValue = (variable: string): boolean => {
		if (this.solution.getVariables().indexOf(variable) === -1) {
			throw new Error('Variable not in solution')
		}
		return !this.solution.isNegated(variable)
	}
	getVariables = () => {
		return this.solution.getVariables()
	}
	exists = (): boolean => {
		return !!this.solution
	}
	toString = (): string => {
		return this.exists() ? 'None' : this.solution.toString()
	}
}

class SatSolver {
	clauses: Array<Clause>
	solutions: Array<Solution>
	constructor() {
		this.clauses = []
		this.solutions = []
	}
	addClause(clause: Clause) {
		this.clauses.push(clause)
		this.solutions = this.solutions
			.map(solution => solution.addClause(clause))
			.filter(solution => !solution.exists())

		if (!this.solutions.length) {
			this.solve()
		}
	}
	solve() {
		const solution = new Solution(this.clauses, this.solutions)
		if (solution.exists()) {
			this.solutions.push(solution)
		}
		this.throwIfNotSat()
		return solution
	}

	evaluate(variable: string): ?boolean {
		const trueSolution = new Solution([...this.clauses, new True(variable)])
		if (!trueSolution.exists()) {
			return false
		}

		this.solutions.push(trueSolution)
		const falseSolution = new Solution([...this.clauses, new False(variable)])
		if (falseSolution.exists()) {
			this.solutions.push(falseSolution)
			return null
		}
		return true
	}

	collectMissings(variable: string): void {
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
	solver: SatSolver
	constructor() {
		this.rules = []
		this.solver = new SatSolver()
	}
	addRule = (rule: BooleanRule) => {
		this.rules.push(rule)
		rule.toCnf().forEach(clause => this.solver.addClause(clause))
	}
	// TODO : if not applicable, add possibility to remove rule
	evaluate = (variable: string) => {
		const value = this.solver.evaluate(variable)
		if (value === null) {
			return this.solver.collectMissings(variable)
		}
		return value
	}
}

export const Rules = {
	OnePossibilityAmong,
	True,
	Or,
	False
}
