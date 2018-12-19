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

class Solution {
	solution: Clause
	constructor(clauses: Array<Clause>, excludedSolutions: Array<Solution> = []) {
		const variables = []
		const cnf = [
			clauses,
			excludedSolutions.map(solution => solution.negate())
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
	isCompatibleWith = (clause: Clause) => {
		new Solution(clause)
	}
}

class SatSolver {
	clauses: Array<Clause> = []
	solutions: Array<Solution> = []

	addClause(clause: Clause) {
		this.clauses.push(clause)
		this.solutions = this.solutions.filter(
			solution => !solution.isCompatibleWith(clause)
		)
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
	findAllSolutions() {}
	evaluate(variable: string) {
		// const variable =
	}
	throwIfNotSat = () => {
		if (!this.solutions.length) {
			throw new Error(
				'Impossibilité logique : les règles spécifiées ne sont pas compatibles entre elles'
			)
		}
	}

	evaluate = (variable: string): ?boolean => {
		if (!(variable in this.variableToNumber)) {
			return null
		}
		const isTrue = satSolve(this.numVars, [
			...this.cnf,
			new True(variable).toNumbers(this.variableToNumber)
		])
		const isFalse = satSolve(this.numVars, [
			...this.cnf,
			new False(variable).toNumbers(this.variableToNumber)
		])
		return isTrue && isFalse ? null : isTrue ? true : false
	}
}

export default class BooleanEngine {
	rules: Array<BooleanRule> = []
	evaluation: Evaluation = new Evaluation()
	addRule = (rule: BooleanRule) => {
		this.rules.push(rule)
		rule.toCnf().forEach(clause => this.evaluation.addClause(clause))
	}
	// TODO : if not applicable, add possibility to remove rule
	evaluate = (variable: string) => {
		const evaluation = this.evaluation.evaluate(variable)
		if (evaluation === null) {
			return this.collectMissings(variable)
		}
	}
	collectMissings = (variable: string) => {}
}

export const Rules = {
	OnePossibilityAmong,
	True,
	False
}
