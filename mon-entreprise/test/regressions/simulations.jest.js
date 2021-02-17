// The goal of these tests is to avoid deploying unwanted changes in the calculations. We run a number
// of simulations and persist their results in a snapshot (ie, a file commited in git). Our test runner,
// Jest, then compare the existing snapshot with the current Engine calculation and reports any difference.
//
// We only persist targets values in the file system, in order to be resilient to rule renaming (if a rule is
// renamed the test configuration may be adapted but the persisted snapshot will remain unchanged).

/* eslint-disable no-undef */
import Engine from 'publicodes'
import rules from '../../../modele-social'
import { engineOptions } from '../../source/components/utils/EngineContext'
import aideDéclarationConfig from '../../source/pages/Gérer/AideDéclarationIndépendant/config.yaml'
import artisteAuteurConfig from '../../source/pages/Simulateurs/configs/artiste-auteur.yaml'
import autoentrepreneurConfig from '../../source/pages/Simulateurs/configs/auto-entrepreneur.yaml'
import independantConfig from '../../source/pages/Simulateurs/configs/indépendant.yaml'
import professionLibéraleConfig from '../../source/pages/Simulateurs/configs/profession-libérale.yaml'
import remunerationDirigeantConfig from '../../source/pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import employeeConfig from '../../source/pages/Simulateurs/configs/salarié.yaml'
import aideDéclarationIndépendantsSituations from './aide-déclaration-indépendants.yaml'
import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
import autoEntrepreneurSituations from './simulations-auto-entrepreneur.yaml'
import impotSocieteSituations from './simulations-impôt-société.yaml'
import independentSituations from './simulations-indépendant.yaml'
import professionsLibéralesSituations from './simulations-professions-libérales.yaml'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import employeeSituations from './simulations-salarié.yaml'

const roundResult = (arr) => arr.map((x) => Math.round(x))
const engine = new Engine(rules, engineOptions)
const runSimulations = (situations, targets, baseSituation = {}) =>
	Object.entries(situations).map(([name, situations]) =>
		situations.forEach((situation) => {
			Object.keys(situation).forEach((situationRuleName) => {
				// TODO: This check may be moved in the `engine.setSituation` method
				if (!Object.keys(engine.getParsedRules()).includes(situationRuleName)) {
					throw new Error(
						`La règle ${situationRuleName} n'existe pas dans la base de règles.`
					)
				}
			})
			engine.setSituation({ ...baseSituation, ...situation })
			const res = targets.map((target) => engine.evaluate(target).nodeValue)

			const evaluatedNotifications = Object.values(engine.getParsedRules())
				.filter(
					(rule) =>
						rule.rawNode['type'] === 'notification' &&
						!!engine.evaluate(rule.dottedName).nodeValue
				)
				.map((node) => node.dottedName)

			const snapshotedDisplayedNotifications = evaluatedNotifications.length
				? `\nNotifications affichées : ${evaluatedNotifications.join(', ')}`
				: ''
			// Stringify is not required, but allows the result to be displayed in a single
			// line in the snapshot, which considerably reduce the number of lines of this snapshot
			// and improve its readability.
			expect(
				JSON.stringify(roundResult(res)) + snapshotedDisplayedNotifications
			).toMatchSnapshot(name)
		})
	)

it('calculate simulations-salarié', () => {
	runSimulations(
		employeeSituations,
		employeeConfig.objectifs,
		employeeConfig.situation
	)
})

it('calculate simulations-indépendant', () => {
	const targets = independantConfig.objectifs.reduce(
		(acc, cur) => [...acc, ...cur.objectifs],
		[]
	)
	runSimulations(independentSituations, targets, independantConfig.situation)
})

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		autoEntrepreneurSituations,
		autoentrepreneurConfig.objectifs,
		autoentrepreneurConfig.situation
	)
})

it('calculate simulations-rémunération-dirigeant (assimilé salarié)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			dirigeant: "'assimilé salarié'",
		},
		'assimilé salarié'
	)
})

it('calculate simulations-rémunération-dirigeant (auto-entrepreneur)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			dirigeant: "'auto-entrepreneur'",
		},
		'auto-entrepreneur'
	)
})

it('calculate simulations-rémunération-dirigeant (indépendant)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			dirigeant: "'indépendant'",
		},
		'indépendant'
	)
})

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		artisteAuteurConfig.objectifs,
		artisteAuteurConfig.situation
	)
})

it('calculate aide-déclaration-indépendant', () => {
	runSimulations(
		aideDéclarationIndépendantsSituations,
		aideDéclarationConfig.objectifs,
		{
			"aide déclaration revenu indépendant 2020 . nature de l'activité":
				"'commerciale ou industrielle'",
			...aideDéclarationConfig.situation,
		}
	)
})

it('calculate simulations-professions-libérales', () => {
	runSimulations(
		professionsLibéralesSituations,
		professionLibéraleConfig.objectifs,
		{
			...professionLibéraleConfig.situation,
			'entreprise . activité . libérale réglementée': 'oui',
		}
	)
})

it('calculate simulations-impot-société', () => {
	runSimulations(impotSocieteSituations, [
		'entreprise . impôt sur les sociétés',
		'entreprise . impôt sur les sociétés . contribution sociale',
	])
})
