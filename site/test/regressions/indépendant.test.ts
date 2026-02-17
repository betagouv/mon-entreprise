import rules from 'modele-ti'
import { expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import independentSituations from './indépendant.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'indépendant . rémunération . brute',
		'indépendant . cotisations et contributions . cotisations',
		'indépendant . rémunération . nette',
		'indépendant . revenu professionnel',
		'impôt . montant',
		'indépendant . rémunération . nette . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(
		engine,
		independentSituations,
		objectifs,
		configIndépendant.situation
	)

	expect(
		getMissingVariables(
			engine
				.setSituation(configIndépendant.situation)
				.evaluate('indépendant . rémunération . nette')
		)
	).toMatchInlineSnapshot(`
		[
		  "entreprise . activité",
		  "entreprise . activité . commerciale . débit de tabac",
		  "entreprise . activité . saisonnière",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . date de création",
		  "entreprise . imposition . IR . régime micro-fiscal",
		  "indépendant . IJSS",
		  "indépendant . conjoint collaborateur",
		  "indépendant . cotisations et contributions",
		  "indépendant . cotisations et contributions . cotisations . exonérations . invalidité",
		  "indépendant . cotisations facultatives",
		  "indépendant . revenus étrangers",
		  "indépendant . rémunération . impôt",
		  "indépendant . rémunération . nette",
		  "indépendant . rémunération . nette . après impôt",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
