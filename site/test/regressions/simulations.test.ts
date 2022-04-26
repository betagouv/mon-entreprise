// The goal of these tests is to avoid deploying unwanted changes in the calculations. We run a number
// of simulations and persist their results in a snapshot (ie, a file commited in git). Our test runner,
// Jest, then compare the existing snapshot with the current Engine calculation and reports any difference.
//
// We only persist targets values in the file system, in order to be resilient to rule renaming (if a rule is
// renamed the test configuration may be adapted but the persisted snapshot will remain unchanged).

import rules, { DottedName } from 'modele-social'
import { expect, it } from 'vitest'
import { engineFactory } from '../../source/components/utils/EngineContext'
import aideDéclarationConfig from '../../source/pages/gerer/declaration-charges-sociales-independant/_config.yaml'
import artisteAuteurConfig from '../../source/pages/Simulateurs/configs/artiste-auteur.yaml'
import autoentrepreneurConfig from '../../source/pages/Simulateurs/configs/auto-entrepreneur.yaml'
import dividendesConfig from '../../source/pages/Simulateurs/configs/dividendes.yaml'
import independantConfig from '../../source/pages/Simulateurs/configs/indépendant.yaml'
import professionLibéraleConfig from '../../source/pages/Simulateurs/configs/profession-libérale.yaml'
import remunerationDirigeantConfig from '../../source/pages/Simulateurs/configs/rémunération-dirigeant.yaml'
import employeeConfig from '../../source/pages/Simulateurs/configs/salarié.yaml'
import { Simulation } from '../../source/reducers/rootReducer'
import aideDéclarationIndépendantsSituations from './assistant-charges-sociales.yaml'
import artisteAuteurSituations from './simulations-artiste-auteur.yaml'
import autoEntrepreneurSituations from './simulations-auto-entrepreneur.yaml'
import dividendesSituations from './simulations-dividendes.yaml'
import impotSocieteSituations from './simulations-impôt-société.yaml'
import independentSituations from './simulations-indépendant.yaml'
import professionsLibéralesSituations from './simulations-professions-libérales.yaml'
import remunerationDirigeantSituations from './simulations-rémunération-dirigeant.yaml'
import employeeSituations from './simulations-salarié.yaml'

type SituationsSpecs = Record<string, Simulation['situation'][]>
const roundResult = (arr: number[]) => arr.map((x) => Math.round(x))
const engine = engineFactory(rules, {
	logger: {
		warn: () => undefined,
		error: (m: string) => console.error(m),
		log: () => undefined,
	},
})
const runSimulations = (
	situationsSpecs: SituationsSpecs,
	objectifs: DottedName[],
	baseSituation: Simulation['situation'] = {}
) =>
	Object.entries(situationsSpecs).map(([name, situations]) =>
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
			const res = objectifs.map(
				(objectif) => engine.evaluate(objectif).nodeValue
			)

			const evaluatedNotifications = Object.values(engine.getParsedRules())
				.filter(
					(rule) =>
						rule.rawNode.type === 'notification' &&
						engine.evaluate(rule.dottedName).nodeValue === true
				)
				.map((node) => node.dottedName)

			const snapshotedDisplayedNotifications = evaluatedNotifications.length
				? `\nNotifications affichées : ${evaluatedNotifications.join(', ')}`
				: ''
			// Stringify is not required, but allows the result to be displayed in a single
			// line in the snapshot, which considerably reduce the number of lines of this snapshot
			// and improve its readability.
			expect(
				JSON.stringify(roundResult(res as number[])) +
					snapshotedDisplayedNotifications
			).toMatchSnapshot(name)
		})
	)

const getMissingVariables = (
	evaluatedNode: ReturnType<typeof engine['evaluate']>
) =>
	Object.entries(evaluatedNode.missingVariables)
		.sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
		.map(([name]) => name)

it('calculate simulations-salarié', () => {
	runSimulations(
		employeeSituations,
		employeeConfig.objectifs,
		employeeConfig.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...employeeConfig.situation,
					'contrat salarié . rémunération . brut de base': '3000 €/mois',
				})
				.evaluate('contrat salarié . rémunération . net après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "contrat salarié",
		  "contrat salarié . convention collective",
		  "contrat salarié . temps de travail . temps partiel",
		  "contrat salarié . rémunération . primes . activité . base",
		  "contrat salarié . temps de travail . heures supplémentaires",
		  "contrat salarié . frais professionnels . abonnement transports publics . montant",
		  "contrat salarié . frais professionnels . transports personnels . carburant faible émission . montant",
		  "contrat salarié . déduction forfaitaire spécifique",
		  "contrat salarié . frais professionnels . titres-restaurant",
		  "contrat salarié . frais professionnels . transports personnels . forfait mobilités durables . montant",
		  "contrat salarié . rémunération . avantages en nature",
		  "contrat salarié . rémunération . primes . fin d'année . treizième mois",
		  "contrat salarié . complémentaire santé . forfait",
		  "contrat salarié . complémentaire santé . part employeur",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "contrat salarié . statut cadre",
		  "contrat salarié . régime des impatriés",
		  "établissement . localisation",
		  "impôt . méthode de calcul",
		]
	`)
})

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . cotisations',
		'dirigeant . rémunération . nette',
		'dirigeant . indépendant . revenu professionnel',
		'impôt . montant',
		'dirigeant . rémunération . nette après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'dirigeant . indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(independentSituations, objectifs, independantConfig.situation)
})

it('calculate simulations-auto-entrepreneur', () => {
	runSimulations(
		autoEntrepreneurSituations,
		autoentrepreneurConfig.objectifs,
		autoentrepreneurConfig.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation({
					...autoentrepreneurConfig.situation,
					"dirigeant . auto-entrepreneur . chiffre d'affaires": '30000 €/an',
				})
				.evaluate('dirigeant . auto-entrepreneur . net après impôt')
		)
	).toMatchInlineSnapshot(`
		[
		  "entreprise . activité . mixte",
		  "entreprise . activité",
		  "impôt . foyer fiscal . enfants à charge",
		  "entreprise . activité . service ou vente",
		  "impôt . foyer fiscal . situation de famille",
		  "dirigeant . auto-entrepreneur . impôt . versement libératoire",
		  "entreprise . date de création",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . méthode de calcul",
		]
	`)
})

it('calculate simulations-rémunération-dirigeant (assimilé salarié)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			'dirigeant . régime social': "'assimilé salarié'",
		}
	)
})

it('calculate simulations-rémunération-dirigeant (auto-entrepreneur)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		{
			...remunerationDirigeantConfig.situation,
			'entreprise . catégorie juridique': "'EI'",
			'entreprise . catégorie juridique . EI . auto-entrepreneur': 'oui',
		}
	)
})

it('calculate simulations-rémunération-dirigeant (indépendant)', () => {
	runSimulations(
		remunerationDirigeantSituations,
		remunerationDirigeantConfig.objectifs,
		remunerationDirigeantConfig.situation
	)
})

it('calculate simulations-artiste-auteur', () => {
	runSimulations(
		artisteAuteurSituations,
		artisteAuteurConfig.objectifs,
		artisteAuteurConfig.situation
	)
})

it('calculate assistant-charges-sociales', () => {
	runSimulations(
		aideDéclarationIndépendantsSituations,
		aideDéclarationConfig.objectifs,
		{
			'déclaration charge sociales . comptabilité': "'engagement'",
			'entreprise . imposition . régime . micro-fiscal': "'non'",
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
	runSimulations(
		impotSocieteSituations,
		[
			'entreprise . imposition . IS . montant',
			'entreprise . imposition . IS . contribution sociale',
		],
		{
			'entreprise . imposition': "'IS'",
			'entreprise . imposition . IS . éligible taux réduit': 'oui',
		}
	)
})

it('calculate simulations-dividendes', () => {
	runSimulations(
		dividendesSituations,
		[
			...dividendesConfig.objectifs,
			'bénéficiaire . dividendes . cotisations et contributions',
			'impôt . montant',
			'impôt . revenu imposable',
			'bénéficiaire . dividendes . imposables',
			"impôt . taux d'imposition",
		],
		dividendesConfig.situation
	)
})
