/* @flow */
import satSolve from 'boolean-sat'
import { compose, filter, map } from 'ramda'

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
		// One possibility among [a,b,c] is transformed to :
		// [not a or not b] and [not b or not c] and [not a or not c] and [a or b or c]
		return [
			new Clause(this.variables, []),
			...this.variables
				.reduce(
					(acc, x, i, array) => acc.concat(array.slice(i + 1).map(y => [x, y])),
					[]
				)
				.map(negatedTuple => new Clause([], negatedTuple))
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
	// https://en.wikipedia.org/wiki/Phi_coefficient
	const D = (s10 + s11) * (s01 + s00) * (s11 + s01) * (s00 + s10)
	if (D === 0) {
		return 0
	}
	return (s11 * s00 - s01 * s10) / Math.sqrt(D)
}

class Solution extends Clause {
	static computeCorrelation = (
		solutions: Array<Solution>,
		variable: string
	): { [string]: number } => {
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
		return map(
			compose(
				Math.abs,
				booleanCorrelation
			),
			booleanDependencies
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
	getValue = (variable: string): boolean => {
		if (this.getVariables().indexOf(variable) === -1) {
			throw new Error(
				`Variable '${variable}' not in solution '${this.toString()}'`
			)
		}
		return !this.isNegated(variable)
	}
	appliesTo = (clauses: Array<Clause>): ?Solution => {
		return Solution.computeNewSolution([...this.negate(), ...clauses])
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
			.map(solution => solution.appliesTo(this.clauses))
			.filter(Boolean)
		this.solve()
	}
	solve() {
		const solution = Solution.computeNewSolution(this.clauses, this.solutions)
		if (solution) {
			this.solutions.push(solution)
		}
		if (!this.solutions.length) {
			throw new Error(
				'Impossibilité logique : les règles spécifiées ne sont pas compatibles entre elles'
			)
		}
		return solution
	}

	evaluate(variable: string): boolean | undefined {
		if (this.solutions[0].getVariables().indexOf(variable) === -1) {
			return undefined
		}
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
			return undefined
		}
		return true
	}

	collectMissings(variable: string): { [string]: number } {
		/* 	TODO : 
			- rendre l'algorithme deterministe ? (fonctionne ici par échantillonage pour des soucis de perf)
			- isoler les groupe de variables indépendant dans le SatSolver ? 
		*/
		const representativePopulationSize =
			this.solutions[0].getVariables().length * 4
		while (
			this.solutions.length < representativePopulationSize &&
			this.solve()
		) {
			null
		}
		return filter(
			correlation => correlation !== 0,
			Solution.computeCorrelation(this.solutions, variable)
		)
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
	evaluate = (variable: string): boolean | undefined => {
		return this.solver.evaluate(variable)
	}
	collectMissings = (variable: string): { [string]: number } => {
		return this.solver.collectMissings(variable)
	}
}

export const Rules = {
	OnePossibilityAmong,
	True,
	Or,
	False
}
