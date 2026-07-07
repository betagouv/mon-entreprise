import rules from 'modele-ti'
import { expect, it } from 'vitest'

import { DottedName } from '@/domaine/publicodes/DottedName'
import { configIndépendant } from '@/pages/simulateurs/independant/simulationConfig'
import { engineFactory } from '@/utils/publicodes/engineFactory'

import independentSituations from './independant.yaml'
import { getMissingVariables, runSimulations } from './utils'

const engine = engineFactory(rules)

it('calculate simulations-independant', () => {
	const objectifs = [
		'independant . rémunération . brute',
		'independant . cotisations et contributions . cotisations',
		'independant . rémunération . nette',
		'independant . revenu professionnel',
		'impôt . montant',
		'independant . rémunération . nette . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'independant . cotisations et contributions . début activité',
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
				.evaluate('independant . rémunération . nette')
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
		  "independant . conjoint collaborateur",
		  "independant . cotisations et contributions",
		  "independant . cotisations et contributions . cotisations . exonérations . invalidité",
		  "independant . cotisations et contributions . cotisations facultatives",
		  "independant . revenus de remplacement",
		  "independant . revenus étrangers",
		  "independant . rémunération . impôt",
		  "independant . rémunération . nette",
		  "independant . rémunération . nette . après impôt",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
