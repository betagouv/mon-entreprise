// The goal of these tests is to avoid deploying unwanted changes in the calculations. We run a number
// of simulations and persist their results in a snapshot (ie, a file commited in git). Our test runner,
// Jest, then compare the existing snapshot with the current Engine calculation and reports any difference.
//
// We only persist targets values in the file system, in order to be resilient to rule renaming (if a rule is
// renamed the test configuration may be adapted but the persisted snapshot will remain unchanged).

/* eslint-disable no-undef */
import rules from 'Publicode/rules'
import artisteAuteurConfig from '../../source/components/simulationConfigs/artiste-auteur.yaml'
import autoentrepreneurConfig from '../../source/components/simulationConfigs/auto-entrepreneur.yaml'
import independantConfig from '../../source/components/simulationConfigs/indépendant.yaml'
import remunerationDirigeantConfig from '../../source/components/simulationConfigs/rémunération-dirigeant.yaml'
import employeeConfig from '../../source/components/simulationConfigs/salarié.yaml'
import Engine from '../../source/engine'
import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
import autoEntrepreneurSituations from './simulations-auto-entrepreneur.yaml'
import independentSituations from './simulations-indépendant.yaml'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import employeeSituations from './simulations-salarié.yaml'

const roundResult = arr => arr.map(x => Math.round(x))
const engine = new Engine({ rules })
const runSimulations = (
	situations,
	targets,
	baseSituation = {},
	defaultUnits,
	namePrefix = ''
) =>
	Object.entries(situations).map(([name, situations]) =>
		situations.forEach(situation => {
			engine.setSituation({ ...baseSituation, ...situation })
			engine.setDefaultUnits(defaultUnits)
			const res = engine.evaluate(targets).map(node => node.nodeValue)
			// Stringify is not required, but allows the result to be displayed in a single
			// line in the snapshot, which considerably reduce the number of lines of this snapshot
			// and improve its readability.
			expect(JSON.stringify(roundResult(res))).toMatchSnapshot(
				namePrefix + ' ' + name
			)
		})
	)

it('calculate simulations-salarié', () => {
	runSimulations(
		employeeSituations,
		employeeConfig.objectifs,
		employeeConfig.situation,
		['€/mois']
	)
})

it('calculate simulations-indépendant', () => {
	const targets = independantConfig.objectifs.reduce(
		(acc, cur) => [...acc, ...cur.objectifs],
		[]
	)
	runSimulations(independentSituations, targets, independantConfig.situation, [
		'€/an'
	])
})

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		autoEntrepreneurSituations,
		autoentrepreneurConfig.objectifs,
		autoentrepreneurConfig.situation,
		['€/an']
	)
})

it('calculate simulations-rémunération-dirigeant', () => {
	const baseSituation = remunerationDirigeantConfig.situation
	remunerationDirigeantConfig.branches.forEach(({ nom, situation }) => {
		runSimulations(
			remunerationDirigeantSituations,
			remunerationDirigeantConfig.objectifs,
			{ ...baseSituation, ...situation },
			['€/an'],
			`${nom} - `
		)
	})
})

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		artisteAuteurConfig.objectifs,
		artisteAuteurConfig.situation,
		['€/an']
	)
})
