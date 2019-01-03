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
	invert = (): Clause => {
		return new Clause(this.negatedVariables, this.variables)
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

class Solution extends Clause {
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
	static computeNewSolution(
		clauses: Array<Clause>,
		excludedSolutions: Array<Solution> = []
	): ?Solution {
		const variables = []
		const cnf = [
			...clauses,
			...excludedSolutions.map(solution => solution.invert())
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
		return new Solution(trueVariables, falseVariables)
	}
	negate = (): Clause => {
		return this
	}
	getValue = (variable: string): boolean => {
		if (this.getVariables().indexOf(variable) === -1) {
			throw new Error(
				`Variable '${variable}' not in solution '${this.toString()}'`
			)
		}
		return !this.isNegated(variable)
	}
	addClause = (clause: Clause): ?Solution => {
		return Solution.computeNewSolution([this, clause])
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
			.filter(Boolean)

		if (!this.solutions.length) {
			this.solve()
		}
	}
	solve() {
		const solution = Solution.computeNewSolution(this.clauses, this.solutions)
		if (solution) {
			this.solutions.push(solution)
		}
		this.throwIfNotSat()
		return solution
	}

	evaluate(variable: string): ?boolean {
		const trueSolution = Solution.computeNewSolution([
			...this.clauses,
			new True(variable)
		])
		if (!trueSolution) {
			return false
		}

		this.solutions.push(trueSolution)
		const falseSolution = Solution.computeNewSolution([
			...this.clauses,
			new False(variable)
		])
		if (falseSolution) {
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
