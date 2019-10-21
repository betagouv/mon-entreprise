import React from 'react'
import PaySlip from 'Components/PaySlip'
import InputSuggestions from 'Components/conversation/InputSuggestions'
import withSimulationConfig from 'Components/simulationConfigs/withSimulationConfig'
import { useSelector } from 'react-redux'
import { getInputComponent } from 'Engine/generateQuestions'
import { flatRulesSelector } from 'Selectors/analyseSelectors'

export default function FichesDePaie() {
	return (
		<>
			<h1>Exemples de fiches de paie</h1>
			<p>
				Exercice d'implémentation des règles de calculs spécifiques pour les
				sportifs et les artistes du spectacle.
			</p>

			<h2>Cas 1 : Sportif</h2>

			<ul>
				<li>
					<strong>Employeur :</strong> CCN du sport IDCC 2511
				</li>
				<li>
					<strong>Salarié :</strong> entraineur/joueur avec base forfaitaire et
					franchise sur manifestations sportives, contrat à temps partiel
					6h/mois pour son poste d’entraineur.
				</li>
			</ul>

			<FichesSportif />
		</>
	)
}

const suggestions = {
	janvier: {
		'contrat salarié . rémunération . brut de base': 200,
		primesManifestions: [0, 0, 0, 0, 0, 0],
		autresPrimes: 0
	},
	février: {
		'contrat salarié . rémunération . brut de base': 200,
		primesManifestions: [100, 150, 300, 300, 200, 200],
		autresPrimes: 300
	},
	mars: {
		'contrat salarié . rémunération . brut de base': 200,
		primesManifestions: [500, 500, 500, 0, 0, 0],
		autresPrimes: 0
	},
	avril: {
		'contrat salarié . rémunération . brut de base': 200,
		primesManifestions: [0, 0, 0, 0, 0, 0],
		autresPrimes: 0
	}
}

const situation = {
	'contrat salarié . temps de travail . temps partiel': true,
	'contrat salarié . temps de travail . temps contractuel': 6,
	'contrat salarié . complémentaire santé': false
}

const FichesSportif = withSimulationConfig({
	objectifs: [
		'contrat salarié . prix du travail',
		'contrat salarié . rémunération . brut de base',
		'contrat salarié . rémunération . net',
		'contrat salarié . rémunération . net après impôt',
		'contrat salarié . temps de travail',
		'contrat salarié . cotisations'
	],
	situation
})(function() {
	const flatRules = useSelector(flatRulesSelector)
	const getInputFromRule = getInputComponent(flatRules)
	return (
		<>
			<div className="ui__ full-width choice-group">
				<div className="ui__ container">
					<InputSuggestions suggestions={suggestions} />
					Salaire brut de base :<br />
					<input />
					{getInputFromRule('contrat salarié . rémunération . brut de base')}
				</div>
			</div>
			{/** 
                TODO: Créer un composant plus simple qui retourne seulement le champ input sans la question, le bouton "suivant", etc.

                TODO: Créer un formulaire avec :
                    - brut de base
                    - les primes (une case par manifestation pour les 5 premières puis une case "autres manifestations")

                TODO: Composant suggestions pour pré-remplir le formulaire (brut de base et primes) avec les valeur données pour "janvier", "février", etc.
             */}
			<h3>Fiche de paie générée</h3>
			<PaySlip />
		</>
	)
})
