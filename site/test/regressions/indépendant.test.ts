import { DottedName } from 'modele-social'
import { expect, it } from 'vitest'

import { configIndépendant } from '@/pages/simulateurs/indépendant/simulationConfig'

import independentSituations from './indépendant.yaml'
import { engine, getMissingVariables, runSimulations } from './utils'

it('calculate simulations-indépendant', () => {
	const objectifs = [
		'dirigeant . rémunération . totale',
		'dirigeant . rémunération . cotisations',
		'dirigeant . rémunération . net',
		'dirigeant . indépendant . revenu professionnel',
		'impôt . montant',
		'dirigeant . rémunération . net . après impôt',
		'entreprise . charges',
		"entreprise . chiffre d'affaires",
		'dirigeant . indépendant . cotisations et contributions . début activité',
	] as DottedName[]
	runSimulations(independentSituations, objectifs, configIndépendant.situation)

	expect(
		getMissingVariables(
			engine
				.setSituation(configIndépendant.situation)
				.evaluate('dirigeant . rémunération . net')
		)
	).toMatchInlineSnapshot(`
		[
		  "dirigeant . indépendant . IJSS",
		  "dirigeant . indépendant . conjoint collaborateur",
		  "dirigeant . indépendant . cotisations et contributions . exonérations . pension invalidité",
		  "dirigeant . indépendant . revenus étrangers",
		  "dirigeant . rémunération . net",
		  "entreprise . activité . nature",
		  "entreprise . activités",
		  "entreprise . activités . agricole",
		  "entreprise . activités . artisanale",
		  "entreprise . activités . commerciale",
		  "entreprise . activités . libérale",
		  "entreprise . activités . revenus mixtes",
		  "entreprise . activités . saisonnière",
		  "entreprise . activités . service ou vente",
		  "entreprise . associés",
		  "entreprise . catégorie juridique",
		  "entreprise . catégorie juridique . EI",
		  "entreprise . catégorie juridique . EI . auto-entrepreneur",
		  "entreprise . charges",
		  "entreprise . chiffre d'affaires",
		  "entreprise . chiffre d'affaires . vente restauration hébergement",
		  "entreprise . date de cessation",
		  "entreprise . date de création",
		  "entreprise . imposition . IR . type de bénéfices",
		  "impôt . foyer fiscal . revenu imposable . autres revenus imposables",
		  "impôt . méthode de calcul",
		  "situation personnelle . RSA",
		  "situation personnelle . domiciliation fiscale à l'étranger",
		  "établissement . commune . département",
		  "établissement . commune . département . outre-mer",
		]
	`)
})
