import { SimulationConfig } from '@/domaine/SimulationConfig'

export const configSalarié: SimulationConfig = {
	nomModèle: 'modele-social',
	'objectifs exclusifs': [
		'salarie . coût total employeur',
		'salarie . contrat . salaire brut',
		'salarie . contrat . salaire brut . équivalent temps plein',
		'salarie . rémunération . net . à payer avant impôt',
		'salarie . rémunération . net . payé après impôt',
	],
	objectifs: ['salarie . rémunération . contrôle minimum'],
	questions: {
		raccourcis: [
			{
				label: 'Type de contrat',
				dottedName: 'salarie',
			},
			{
				label: 'Cadre',
				dottedName: 'salarie . contrat . statut cadre',
			},
			{
				label: 'Temps partiel',
				dottedName: 'salarie . contrat . temps de travail . temps partiel',
			},
			{
				label: 'Heures supplémentaires',
				dottedName: 'salarie . temps de travail . heures supplémentaires',
			},
			{
				label: 'Titres-restaurant',
				dottedName:
					'salarie . rémunération . frais professionnels . titres-restaurant',
			},
			{
				label: 'Commune',
				dottedName: 'établissement . commune',
			},
			{
				label: 'Emploi franc',
				dottedName:
					'salarie . coût total employeur . aides . emploi franc . éligible',
			},
			{
				label: 'Impôt',
				dottedName: 'impôt . méthode de calcul',
			},
		],
		liste: [
			// # Contrat
			// ## Type de contrat
			'salarie . contrat',
			'salarie . contrat . CDD . motif',
			'salarie . contrat . CDD . durée',
			'salarie . contrat . CDD . indemnité de fin de contrat . CDD jeune vacances',
			'salarie . régimes spécifiques . apprentissage . handicap',
			'salarie . contrat . apprentissage . diplôme',
			'salarie . contrat . apprentissage . âge',
			"salarie . contrat . date d'embauche",
			'salarie . contrat . professionnalisation . âge',
			'salarie . contrat . professionnalisation . formation',
			// ## Congés (si CDD)
			'salarie . contrat . CDD . congés pris',
			// ## Fin de contrat (si CDD)
			'salarie . contrat . CDD . indemnité de fin de contrat . rupture sans indemnité',
			'salarie . contrat . CDD . reconduction en CDI',
			'salarie . contrat . CDD . indemnité de fin de contrat',
			// ## Statut cadre
			'salarie . contrat . statut cadre',
			// # Temps de travail
			// ## Temps partiel
			'salarie . contrat . temps de travail . temps partiel',
			'salarie . contrat . temps de travail . temps partiel . heures par semaine',
			// ## Heures supplémentaires
			'salarie . temps de travail . heures supplémentaires',
			'salarie . temps de travail . heures complémentaires',
			// # Rémunération
			// ## 13ème mois
			"salarie . rémunération . primes . fin d'année",
			// ## Primes
			'salarie . rémunération . primes . activité . base',
			// # Transport
			// ## Transports en commun
			'salarie . rémunération . frais professionnels . trajets domicile travail . transports publics . montant',
			'salarie . rémunération . frais professionnels . trajets domicile travail . transports publics . taux employeur',
			// ## Mobilité durable
			'salarie . rémunération . frais professionnels . trajets domicile travail . forfait mobilités durables . montant',
			// ## Frais de carburant
			'salarie . rémunération . frais professionnels . trajets domicile travail . prime de transport . montant',
			'salarie . rémunération . frais professionnels . trajets domicile travail . prime de transport . véhicule electrique hybride hydrogène',
			// # Avantages en nature
			// ## Mutuelle
			'salarie . cotisations . prévoyances . santé . montant',
			'salarie . cotisations . prévoyances . santé . taux employeur',
			// ## Titres-restaurant
			'salarie . rémunération . frais professionnels . titres-restaurant',
			'salarie . rémunération . frais professionnels . titres-restaurant . nombre',
			'salarie . rémunération . frais professionnels . titres-restaurant . montant unitaire',
			'salarie . rémunération . frais professionnels . titres-restaurant . taux employeur',
			'salarie . rémunération . avantages en nature',
			// ## Repas
			'salarie . rémunération . avantages en nature . nourriture',
			'salarie . rémunération . avantages en nature . nourriture . repas par mois',
			// ## NTIC
			'salarie . rémunération . avantages en nature . ntic',
			'salarie . rémunération . avantages en nature . ntic . coût appareils',
			'salarie . rémunération . avantages en nature . ntic . abonnements',
			// ## Autres avantages en nature
			'salarie . rémunération . avantages en nature . autres',
			'salarie . rémunération . avantages en nature . autres . montant',
			// # Entreprise
			// ## Convention collective
			'salarie . convention collective',
			'salarie . convention collective . BTP . catégorie',
			'salarie . convention collective . BTP . congés intempéries . caisse de rattachement',
			'salarie . convention collective . sport . joueur entraineur',
			'salarie . convention collective . sport . primes . nombre de manifestations',
			'salarie . convention collective . sport . primes . manifestation 1',
			'salarie . convention collective . sport . primes . manifestation 2',
			'salarie . convention collective . sport . primes . manifestation 3',
			'salarie . convention collective . sport . primes . manifestation 4',
			'salarie . convention collective . sport . primes . manifestation 5',
			'salarie . convention collective . sport . primes . autres manifestations',
			'salarie . convention collective . sport . cotisations . régime frais de santé . option',
			'salarie . convention collective . sport . refus exonération cotisation AT',
			'salarie . régimes spécifiques . intermittents du spectacle',
			'salarie . régimes spécifiques . intermittents du spectacle . artiste . nombre jours travaillés',
			'salarie . régimes spécifiques . intermittents du spectacle . artiste . acteur de complément',
			'salarie . régimes spécifiques . intermittents du spectacle . artiste . activité accessoire',
			'salarie . convention collective . optique . coefficient',
			// ## Effectif
			'entreprise . salaries . effectif . seuil',
			'entreprise . salaries . ratio alternants',
			// ## Commune
			'établissement . commune',
			// ## Taux AT/MP
			'établissement . taux ATMP',
			'établissement . taux ATMP . taux collectif',
			'salarie . cotisations . ATMP . taux fonctions support',
			// ## TVA
			'entreprise . TVA',
			// ## Association
			'entreprise . association non lucrative',
			// ## JEI
			'salarie . cotisations . exonérations . JEI',
			// ## Lodeom (si DROM)
			"salarie . cotisations . exonérations . lodeom . secteurs d'activité éligibles",
			'salarie . cotisations . exonérations . lodeom . zone un . barème innovation et croissance',
			'salarie . cotisations . exonérations . lodeom . zone un . barème compétitivité renforcée',
			'salarie . cotisations . exonérations . lodeom . zone deux . barème renforcé',
			// ## RGDU
			'salarie . cotisations . exonérations . RGDU . caisse de congés payés',
			// # Salarié⋅e
			// ## DFS
			'salarie . régimes spécifiques . DFS',
			// ## Taux réduits cas particulier
			'salarie . régimes spécifiques . taux réduits',
			'salarie . régimes spécifiques . taux réduits . profession',
			// ## Emploi franc
			'salarie . coût total employeur . aides . emploi franc . éligible',
			// ## Résidence fiscale
			"situation personnelle . domiciliation fiscale à l'étranger",
			// ## Régime des impatriés
			'salarie . régimes spécifiques . impatriés',
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
			'salarie . cotisations . exonérations . zones lodeom',
			'salarie . cotisations . exonérations . lodeom . zone un . barèmes',
			'salarie . cotisations . exonérations . lodeom . zone deux . barèmes',
		],
	},
	'unité par défaut': '€/mois',
	situation: {
		dirigeant: 'non',
		'entreprise . catégorie juridique': "''",
		'entreprise . imposition': 'non',
		'salarie . activité partielle': 'non',
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
					si: 'salarie . contrat . salaire brut <= 6000 €/mois',
					alors: "'taux neutre'",
				},
				{
					sinon: "'barème standard'",
				},
			],
		},
	},
}
