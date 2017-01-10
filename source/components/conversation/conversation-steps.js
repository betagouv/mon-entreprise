import React from 'react'
import { percentage, euro } from './formValueTypes.js'
import {simulationDate} from './openfisca.js'

export default {

	// DEFAULTS : These inputs do not exist, but the API needs them
	'defaults': {
		adapt: () => ({
			allegement_fillon_mode_recouvrement: 'anticipe_regularisation_fin_de_periode',
			allegement_cotisation_allocations_familiales_mode_recouvrement: 'anticipe_regularisation_fin_de_periode',
			contrat_de_travail_debut: simulationDate(),
		}),
	},

	/*****************************
	 BASIC INPUT FORM FIELDS */

	/* Le type d'entreprise association 190X n'est pas défini comme une catégorie dans OpenFisca,
	mais comme un booléen */
	'typeEntreprise': {
		initial: 'entreprise',
		adapt: raw => raw === 'entreprise_est_association_non_lucrative' && {
			'entreprise_est_association_non_lucrative': true,
		},
	},

	/* Nous simulons une embauche, donc nous incrémentons l'effectif */
	'effectifEntreprise': {
		initial: 0,
		adapt: raw => ({'effectif_entreprise': +raw + 1}),
	},

	/* Nous voulons un ratio : on multiplie donc le nombre d'heures par semaine capté par
	 (la durée légale mensuelle divisée par la durée légale hebdomadaire) */
	'heuresParSemaine': {
		initial: 30,
		adapt: raw => ({ 'heures_remunerees_volume': raw * (151.66 / 35)}),
	},

	'typeSalaireEntré': {
		initial: 'brut',
		adapt: () => ({}),
	},

	'salaire': {
		initial: 2300,
		adapt: (raw, value, values) => ({
			// Use other values to determine the name of this key
			[values['typeSalaireEntré'] == 'brut' ?
				'salaire_de_base' :
				'salaire_net_a_payer'
			]: value }),
	},

	'tempsDeTravail': {
		initial: 'temps_plein',
		adapt: raw => ({'contrat_de_travail': raw}),
	},

	'categorieSalarié': {
		initial: 'prive_non_cadre',
		adapt: raw => ({'categorie_salarie': raw}),
	},





	/****************************
	 ADVANCED VIEW STEPS

	One step is a Question, and an Answer field for the user.
	The steps, called in Conversation.js, use these data.
	The value stored in the state is the raw user input.
	The value is validated (with a "pre" normalisation step) to be able to submit the step.
	It is then 'adapted' into an object fragment. Object fragments are merged to be sent to the API.
	*/

	'mutuelle': { // the name of the form field. Data is stored in state.form.advancedQuestions.mutuelle
		// The attributes of the HTML form field
		attributes: {
			/* We use 'text' inputs : browser behaviour with input=number
			doesn't quite work with our "update simulation on input change"... */
			inputMode: 'numeric',
			placeholder: 'votre réponse', // help for the first input
		},
		valueType: euro, /* Will give the input a suffix (€), a human representation
		that will be used in the form resume, and a validation function */
		defaultValue: '40', // The user can pass steps in the advanced view, this value is set
		helpText: // What will be displayed in the help box
			<p>
				L'employeur a l'obligation en 2016 de proposer et financer à 50% une offre
				de complémentaire santé. Son montant est libre, tant qu'elle couvre un panier légal de soins.
				<br/>
				<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F33754" target="_blank">
					Voir les détails (service-public.fr)
				</a>
			</p>,
		adapt: (raw, validated) => ({'complementaire_sante_montant': validated}),
	},

	'alsaceMoselle': {
		choices: [ 'Oui', 'Non' ],
		defaultValue: 'Non',
		helpText:
		<p>
			Cette affiliation est obligatoire si l'activité est exercée dans les départements du Bas-Rhin, du Haut-Rhin et de la Moselle. Elle l'est aussi dans certains autres cas, expliqués sur <a href="http://regime-local.fr/salaries/" target="_blank">cette page.</a>
			<br/>
		</p>,
		adapt: raw => ({salarie_regime_alsace_moselle: raw === 'Oui' ? 1 : 0}),
	},

	'codeINSEE': {
		defaultValue: {codeInsee: '29019', nomCommune: 'Ville de 100 000 habitants'},
		human: v => v.nomCommune,
		helpText: <p>Quelle est la commune du lieu de travail effectif du salarié ?</p>,
		adapt: (selectObject) => ({'depcom_entreprise': selectObject && selectObject.codeInsee || ''}),
	},

	'pourcentage_alternants': {
		attributes: {
			inputMode: 'numeric',
		},
		valueType: percentage,
		defaultValue: '0',
		helpText: <p>Ce pourcentage de l'ensemble de vos salariés nous permet de calculer le montant de la Contribution Supplémentaire à l'Apprentissage, destinée à encourager cette forme d'emploi.</p>,
		adapt: (raw, validated) => ({'ratio_alternants': validated / 100}),
	},

	'tauxRisqueConnu': {
		choices: [ 'Oui', 'Non' ],
		helpText:
		<p>
			C'est le taux de la cotisation accidents du travail (AT) et maladies professionnelles (MP). Il est accessible sur&nbsp;<a href="http://www.net-entreprises.fr/html/compte-accident-travail.htm" target="_blank">net-entreprises.fr</a> ou reçu par courrier.
		</p>,
	},

	'tauxRisque': {
		attributes: {
			inputMode: 'numeric',
			placeholder: 'Par ex. 1,1',
		},
		valueType: percentage,
		defaultValue: '1',
		adapt: validated => ({taux_accident_travail: validated / 100}),
	},

	'selectTauxRisque': {
		fields: [ 'resume' ],
		human: v => v.text,
		optionsURL: 'https://cdn.rawgit.com/sgmap/taux-collectifs-cotisation-atmp/master/taux-2016.json',
	},

	'penibilite': {
		choices: [ 'Plusieurs facteurs', 'Un facteur', 'Non'],
		defaultValue: 'Non',
		helpText: <p>
			Les employeurs qui exposent un salarié à un facteur de pénibilité au-delà des seuils prévus est redevable d'une cotisation de pénibilité additionnelle. Elle est doublée si les facteurs sont multiples.
			<br/>
			<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F33777" target="_blank">
				Comprendre la cotisation pénibilité (service-public.fr)
			</a>
		</p>,
		adapt: raw => ({
			exposition_penibilite: {
				'Non': 0, 'Un facteur': 1, 'Plusieurs facteurs': 2
			}[raw]
		}),
	},

	'jei': {
		choices: [ 'Oui', 'Non' ],
		defaultValue: 'Non',
		helpText: <p>
			Votre entreprise doit être éligible à ce statut, et votre employé doit notamment être fortement impliqué dans le projet de R&D.
			<br/>
			<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F31188" target="_blank">
				Voir toutes les conditions (service-public.fr)
			</a>
		</p>,
		adapt: raw => ({jeune_entreprise_innovante: raw === 'Oui' ? 1 : 0}),
	},

	'serviceUtile': {
		choices: [ ':-|', ':-)' ],
		defaultValue: null,
		helpText: <p>
			Dites-nous si ce simulateur vous a été utile
		</p>
	},

	'partage': {},

	'remarque': {
		attributes: {
			cols: 30,
			rows: 6,
			placeholder: 'Votre remarque, accompagnée de votre email si vous voulez un retour.',
		},
		validator: {
			test: v => v !== '',
			error: 'Entrez votre remarque',
		},
		human: v => v.substring(0,20) + '...',
	},

}
