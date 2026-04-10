import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSalarié: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		'salarié . coût total employeur',
		'salarié . contrat . salaire brut',
		'salarié . contrat . salaire brut . équivalent temps plein',
		'salarié . rémunération . net . à payer avant impôt',
		'salarié . rémunération . net . payé après impôt',
	],
	objectifs: ['salarié . rémunération . contrôle minimum'],
	questions: {
		raccourcis: [
			{
				label: 'Type de contrat',
				dottedName: 'salarié',
			},
			{
				label: 'Temps partiel',
				dottedName: 'salarié . contrat . temps de travail . temps partiel',
			},
			{
				label: 'Emploi franc',
				dottedName:
					'salarié . coût total employeur . aides . emploi franc . éligible',
			},
			{
				label: 'Cadre',
				dottedName: 'salarié . contrat . statut cadre',
			},
			{
				label: 'Heures supplémentaires',
				dottedName: 'salarié . temps de travail . heures supplémentaires',
			},
			{
				label: 'Titres-restaurant',
				dottedName:
					'salarié . rémunération . frais professionnels . titres-restaurant',
			},
			{
				label: 'Impôt',
				dottedName: 'impôt . méthode de calcul',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
		],
		'liste': [
			// # Contrat
			// ## Type de contrat
			'salarié . contrat',
			'salarié . contrat . CDD . motif',
			'salarié . contrat . CDD . durée',
			'salarié . contrat . CDD . indemnité de fin de contrat . CDD jeune vacances',
			'salarié . régimes spécifiques . apprentissage . handicap',
			'salarié . contrat . apprentissage . diplôme',
			'salarié . contrat . apprentissage . âge',
			"salarié . contrat . date d'embauche",
			'salarié . contrat . professionnalisation . âge',
			'salarié . contrat . professionnalisation . formation',
			// ## Congés (si CDD)
			'salarié . contrat . CDD . congés pris',
			// ## Fin de contrat (si CDD)
			'salarié . contrat . CDD . indemnité de fin de contrat . rupture sans indemnité',
			'salarié . contrat . CDD . reconduction en CDI',
			'salarié . contrat . CDD . indemnité de fin de contrat',
			// ## Statut cadre
			'salarié . contrat . statut cadre',
			// # Temps de travail
			// ## Temps partiel
			'salarié . contrat . temps de travail . temps partiel',
			'salarié . contrat . temps de travail . temps partiel . heures par semaine',
			// ## Heures supplémentaires
			'salarié . temps de travail . heures supplémentaires',
			'salarié . temps de travail . heures complémentaires',
			// # Rémunération
			// ## 13ème mois
			"salarié . rémunération . primes . fin d'année",
			// ## Primes
			'salarié . rémunération . primes . activité . base',
			// # Transport
			// ## Transports en commun
			'salarié . rémunération . frais professionnels . trajets domicile travail . transports publics . montant',
			'salarié . rémunération . frais professionnels . trajets domicile travail . transports publics . taux employeur',
			// ## Mobilité durable
			'salarié . rémunération . frais professionnels . trajets domicile travail . forfait mobilités durables . montant',
			// ## Frais de carburant
			'salarié . rémunération . frais professionnels . trajets domicile travail . prime de transport . montant',
			'salarié . rémunération . frais professionnels . trajets domicile travail . prime de transport . véhicule electrique hybride hydrogène',
			// # Avantages en nature
			// ## Mutuelle
			'salarié . cotisations . prévoyances . santé . montant',
			'salarié . cotisations . prévoyances . santé . taux employeur',
			// ## Titres-restaurant
			'salarié . rémunération . frais professionnels . titres-restaurant',
			'salarié . rémunération . frais professionnels . titres-restaurant . nombre',
			'salarié . rémunération . frais professionnels . titres-restaurant . montant unitaire',
			'salarié . rémunération . frais professionnels . titres-restaurant . taux employeur',
			'salarié . rémunération . avantages en nature',
			// ## Repas
			'salarié . rémunération . avantages en nature . nourriture',
			'salarié . rémunération . avantages en nature . nourriture . repas par mois',
			// ## NTIC
			'salarié . rémunération . avantages en nature . ntic',
			'salarié . rémunération . avantages en nature . ntic . coût appareils',
			'salarié . rémunération . avantages en nature . ntic . abonnements',
			// ## Autres avantages en nature
			'salarié . rémunération . avantages en nature . autres',
			'salarié . rémunération . avantages en nature . autres . montant',
			// # Entreprise
			// ## Convention collective
			'salarié . convention collective',
			'salarié . convention collective . BTP . catégorie',
			'salarié . convention collective . BTP . congés intempéries . caisse de rattachement',
			'salarié . convention collective . sport . joueur entraineur',
			'salarié . convention collective . sport . primes . nombre de manifestations',
			'salarié . convention collective . sport . primes . manifestation 1',
			'salarié . convention collective . sport . primes . manifestation 2',
			'salarié . convention collective . sport . primes . manifestation 3',
			'salarié . convention collective . sport . primes . manifestation 4',
			'salarié . convention collective . sport . primes . manifestation 5',
			'salarié . convention collective . sport . primes . autres manifestations',
			'salarié . convention collective . sport . cotisations . régime frais de santé . option',
			'salarié . convention collective . sport . refus exonération cotisation AT',
			'salarié . régimes spécifiques . intermittents du spectacle',
			'salarié . régimes spécifiques . intermittents du spectacle . artiste . nombre jours travaillés',
			'salarié . régimes spécifiques . intermittents du spectacle . artiste . acteur de complément',
			'salarié . régimes spécifiques . intermittents du spectacle . artiste . activité accessoire',
			'salarié . convention collective . optique . coefficient',
			// ## Effectif
			'entreprise . salariés . effectif . seuil',
			'entreprise . salariés . ratio alternants',
			// ## Commune
			'établissement . commune',
			// ## Taux AT/MP
			'établissement . taux ATMP',
			'établissement . taux ATMP . taux collectif',
			'salarié . cotisations . ATMP . taux fonctions support',
			// ## TVA
			'entreprise . TVA',
			// ## Association
			'entreprise . association non lucrative',
			// ## JEI
			'salarié . cotisations . exonérations . JEI',
			// ## Lodeom (si DROM)
			"salarié . cotisations . exonérations . lodeom . secteurs d'activité éligibles",
			'salarié . cotisations . exonérations . lodeom . zone un . barème innovation et croissance',
			'salarié . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée',
			'salarié . cotisations . exonérations . lodeom . zone deux . barème renforcé',
			// # Salarié⋅e
			// ## DFS
			'salarié . régimes spécifiques . DFS',
			// ## Taux réduits cas particulier
			'salarié . régimes spécifiques . taux réduits',
			'salarié . régimes spécifiques . taux réduits . profession',
			// ## Emploi franc
			'salarié . coût total employeur . aides . emploi franc . éligible',
			// ## Résidence fiscale
			"situation personnelle . domiciliation fiscale à l'étranger",
			// ## Régime des impatriés
			'salarié . régimes spécifiques . impatriés',
			// # Impôt
			// ## Impôt sur le revenus
			'impôt . méthode de calcul',
			'impôt . taux personnalisé',
			'impôt . foyer fiscal . situation de famille',
			'impôt . foyer fiscal . enfants à charge',
			'impôt . foyer fiscal . parent isolé',
			'impôt . foyer fiscal . revenu imposable . autres revenus imposables',
		],
		'liste noire': [
			'salarié . cotisations . exonérations . zones lodeom',
			'salarié . cotisations . exonérations . lodeom . zone un . barèmes',
			'salarié . cotisations . exonérations . lodeom . zone deux . barèmes',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
		'salarié . activité partielle': 'non',
		'impôt . méthode de calcul . par défaut': {
			// On utilise le taux neutre qui est plus rapide à calculer et qui correspond
			// à une fiche de paie pour laquelle le taux effectif n'est pas connu
			// (employeur qui n'a pas reçu de taux de la DGFiP ou bien jeune qui démarre
			// un premier travail). cf #1121
			//
			// Pour les hauts revenus le barème au taux neutre pose problème car il
			// provoque des effets de seuils importants (voir #1661). On revient donc à
			// la méthode “au barème” par défaut pour les hauts revenus. La valeur de
			// 6000 €/mois correspond au seuil où les tranches du barème neutre
			// augmentent par paliers de 4% ou 5%.
			variations: [
				{
					si: 'salarié . contrat . salaire brut <= 6000 €/mois',
					alors: "'taux neutre'",
				},
				{
					sinon: "'barème standard'",
				},
			],
		},
	},
}
