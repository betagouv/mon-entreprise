import {
	iframeAEPath,
	iframeArtisteAuteurPath,
	iframeAssimileSalariePath,
	iframeChoixStatutPath,
	iframeChomagePartielPath,
	iframeEconomieCollaborativePath,
	iframeEIPath,
	iframeEIRLPath,
	iframeEmbauchePath,
	iframeEURLPath,
	iframeIndependantPath,
	iframeAuxiliaireMedicalPath,
	iframeAvocatPath,
	iframeChargeSocialesPath,
	iframeChirurgienDentistePath,
	iframeDemandeMobilitePath,
	iframeDividendePath,
	iframeExonerationCovid,
	iframeExpertComptable,
	iframeImpotSocietePath,
	iframeMedecinPath,
	iframePAMCPath,
	iframePharmacienPath,
	iframeProfessionLiberalePath,
	iframeRevenuIndependant,
	iframeSageFemmePath,
} from '../../constants/iframePaths'
import { TFunction } from 'react-i18next'

/**
 * Contient l'intégralité des données concernant les différents simulateurs
 * sans dépendance qui compliquerait leur import dans le script de mise à jour
 * des données pour Algolia.
 */
const metadataSrc = (t: TFunction<'translation', string>) => {
	const data = {
		salarié: {
			tracking: 'salarie',
			icône: '🤝',
			title: t(
				'pages.simulateurs.salarié.title',
				'Simulateur de revenus pour salarié'
			),
			iframePath: iframeEmbauchePath,
			meta: {
				description: t(
					'pages.simulateurs.salarié.meta.description',
					"Calcul du salaire net, net après impôt et coût total employeur. Beaucoup d'options disponibles (cadre, stage, apprentissage, heures supplémentaires, etc.)"
				),
				ogDescription: t(
					'pages.simulateurs.salarié.meta.ogDescription',
					"En tant que salarié, calculez immédiatement votre revenu net après impôt à partir du brut mensuel ou annuel. En tant qu'employé, estimez le coût total d'une embauche à partir du brut. Ce simulateur est développé avec les experts de l'Urssaf, et il adapte les calculs à votre situation (statut cadre, stage, apprentissage, heures supplémentaire, titre-restaurants, mutuelle, temps partiel, convention collective, etc.)"
				),
				ogTitle: t(
					'pages.simulateurs.salarié.meta.ogTitle',
					'Salaire brut, net, net après impôt, coût total : le simulateur ultime pour salariés et employeurs'
				),
				title: t(
					'pages.simulateurs.salarié.meta.titre',
					'Salaire brut / net : le convertisseur Urssaf'
				),
			},
			pathId: 'simulateurs.salarié',
			shortName: t('pages.simulateurs.salarié.shortname', 'Salarié'),
			nextSteps: ['chômage-partiel'],
		},
		'entreprise-individuelle': {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'EI',
			},
			iframePath: iframeEIPath,
			icône: '🚶‍♀️',
			meta: {
				description: t(
					'pages.simulateurs.ei.meta.description',
					"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
				),
				ogDescription: t(
					'pages.simulateurs.ei.meta.ogDescription',
					"Grâce au simulateur de revenu pour entreprise individuelle développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
				),
				ogTitle: t(
					'pages.simulateurs.ei.meta.ogTitle',
					'Entreprise individuelle (EI) : calculez rapidement votre revenu net à partir du CA et vice-versa'
				),
				title: t(
					'pages.simulateurs.ei.meta.titre',
					'Entreprise individuelle (EI) : simulateur de revenus'
				),
			},
			pathId: 'simulateurs.entreprise-individuelle',
			shortName: t('pages.simulateurs.ei.shortname', 'Entreprise Individuelle'),
			title: t(
				'pages.simulateurs.ei.title',
				'Simulateur pour entreprise individuelle (EI)'
			),

			nextSteps: ['comparaison-statuts'],
		},
		eirl: {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'EIRL',
			},
			icône: '🚶',
			iframePath: iframeEIRLPath,
			meta: {
				description: t(
					'pages.simulateurs.eirl.meta.description',
					"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
				),
				ogDescription: t(
					'pages.simulateurs.eirl.meta.ogDescription',
					"Grâce au simulateur de revenu pour EIRL développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
				),
				ogTitle: t(
					'pages.simulateurs.eirl.meta.ogTitle',
					"Dirigeant d'EIRL : calculez rapidement votre revenu net à partir du CA et vice-versa"
				),
				title: t(
					'pages.simulateurs.eirl.meta.titre',
					'EIRL : simulateur de revenus pour dirigeant'
				),
			},
			pathId: 'simulateurs.eirl',
			shortName: t('pages.simulateurs.eirl.shortname', 'EIRL'),
			title: t('pages.simulateurs.eirl.title', "Simulateur d'EIRL"),

			nextSteps: ['déclaration-revenu-indépendant-beta', 'comparaison-statuts'],
		},
		sasu: {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'SASU',
			},
			icône: '📘',
			iframePath: iframeAssimileSalariePath,
			meta: {
				description: t(
					'pages.simulateurs.sasu.meta.description',
					'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
				),
				ogDescription: t(
					'pages.simulateurs.sasu.meta.ogDescription',
					'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
				),
				ogTitle: t(
					'pages.simulateurs.sasu.meta.ogTitle',
					'Rémunération du dirigeant de SASU : un simulateur pour connaître votre salaire net'
				),
				title: t(
					'pages.simulateurs.sasu.meta.titre',
					'SASU : simulateur de revenus pour dirigeant'
				),
			},
			pathId: 'simulateurs.sasu',
			shortName: t('pages.simulateurs.sasu.shortname', 'SAS(U)'),
			title: t(
				'pages.simulateurs.sasu.title',
				'Simulateur de revenus pour dirigeant de SASU'
			),
			nextSteps: ['is', 'comparaison-statuts'],
		},
		eurl: {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'EURL',
			},
			icône: '📕',
			iframePath: iframeEURLPath,
			meta: {
				description: t(
					'pages.simulateurs.eurl.meta.description',
					'Calcul du salaire net à partir du total alloué à la rémunération et inversement'
				),
				ogDescription: t(
					'pages.simulateurs.eurl.meta.ogDescription',
					'En tant que dirigeant assimilé-salarié, calculez immédiatement votre revenu net après impôt à partir du total alloué à votre rémunération.'
				),
				ogTitle: t(
					'pages.simulateurs.eurl.meta.ogTitle',
					"Rémunération du dirigeant d'EURL : un simulateur pour connaître votre salaire net"
				),
				title: t(
					'pages.simulateurs.eurl.meta.titre',
					'EURL : simulateur de revenus pour dirigeant'
				),
			},
			pathId: 'simulateurs.eurl',
			shortName: t('pages.simulateurs.eurl.shortname', 'EURL'),
			title: t(
				'pages.simulateurs.eurl.title',
				"Simulateur de revenus pour dirigeant d'EURL"
			),
			nextSteps: [
				'déclaration-revenu-indépendant-beta',
				'is',
				'comparaison-statuts',
			],
		},
		'auto-entrepreneur': {
			tracking: 'auto_entrepreneur',
			icône: '🚶‍♂️',
			iframePath: iframeAEPath,
			meta: {
				description: t(
					'pages.simulateurs.auto-entrepreneur.meta.description',
					"Calcul du revenu à partir du chiffre d'affaires, après déduction des cotisations et des impôts"
				),
				ogDescription: t(
					'pages.simulateurs.auto-entrepreneur.meta.ogDescription',
					"Grâce au simulateur de revenu auto-entrepreneur développé par l'Urssaf, vous pourrez estimer le montant de vos revenus en fonction de votre chiffre d'affaires mensuel ou annuel pour mieux gérer votre trésorerie. Ou dans le sens inverse : savoir quel montant facturer pour atteindre un certain revenu."
				),
				ogTitle: t(
					'pages.simulateurs.auto-entrepreneur.meta.ogTitle',
					'Auto-entrepreneur : calculez rapidement votre revenu net à partir du CA et vice-versa'
				),
				title: t(
					'pages.simulateurs.auto-entrepreneur.meta.titre',
					'Auto-entrepreneurs : simulateur de revenus'
				),
			},
			pathId: 'simulateurs.auto-entrepreneur',
			shortName: t(
				'pages.simulateurs.auto-entrepreneur.shortname',
				'Auto-entrepreneur'
			),
			title: t(
				'pages.simulateurs.auto-entrepreneur.title',
				'Simulateur de revenus auto-entrepreneur'
			),
			nextSteps: ['indépendant', 'comparaison-statuts'],
		},
		indépendant: {
			tracking: 'independant',
			icône: '🏃',
			iframePath: iframeIndependantPath,
			pathId: 'simulateurs.indépendant',
			shortName: t('pages.simulateurs.indépendant.shortname', 'Indépendant'),
			title: t(
				'pages.simulateurs.indépendant.title',
				'Simulateur de revenus pour indépendant'
			),
			meta: {
				title: t(
					'pages.simulateurs.indépendant.meta.title',
					'Indépendant : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.indépendant.meta.description',
					"Calcul du revenu net après impôt et des cotisations à partir du chiffre d'affaires et inversement"
				),
			},
			nextSteps: [
				'déclaration-revenu-indépendant-beta',
				'comparaison-statuts',
				'is',
			],
		},

		'artiste-auteur': {
			icône: '👩‍🎨',
			tracking: 'artiste-auteur',
			iframePath: iframeArtisteAuteurPath,
			meta: {
				title: t(
					'pages.simulateurs.artiste-auteur.meta.title',
					'Artiste-auteur: calcul des cotisations Urssaf'
				),
				description: t(
					'pages.simulateurs.artiste-auteur.meta.description',
					"Estimez les cotisations sociales sur les droits d'auteur et sur le revenu BNC"
				),
				ogTitle: 'Artiste-auteur : estimez vos cotisations Urssaf',
				ogDescription:
					"Renseignez vos revenus (droits d'auteur et bnc) et découvrez immédiatement le montant des cotisations que vous aurez à payer sur l'année.",
			},
			pathId: 'simulateurs.artiste-auteur',
			title: t(
				'pages.simulateurs.artiste-auteur.title',
				'Simulateurs de cotisations d’artiste-auteur'
			),
			shortName: t(
				'pages.simulateurs.artiste-auteur.shortname',
				'Artiste-auteur'
			),
		},
		'chômage-partiel': {
			tracking: 'chomage_partiel',
			pathId: 'simulateurs.chômage-partiel',
			icône: '😷',
			iframePath: iframeChomagePartielPath,
			meta: {
				description: t(
					'pages.simulateurs.chômage-partiel.meta.description',
					"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
				),
				ogDescription: t(
					'pages.simulateurs.chômage-partiel.meta.ogDescription',
					"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG-CRDS)."
				),
				ogTitle: t(
					'pages.simulateurs.chômage-partiel.meta.ogTitle',
					"Simulateur chômage partiel : découvrez l'impact sur le revenu net salarié et le coût total employeur."
				),
				title: t(
					'pages.simulateurs.chômage-partiel.meta.titre',
					"Calcul de l'indemnité chômage partiel : le simulateur Urssaf"
				),
			},
			shortName: t(
				'pages.simulateurs.chômage-partiel.shortname',
				'Chômage partiel'
			),
			title: t(
				'pages.simulateurs.chômage-partiel.title',
				"Simulateur du calcul de l'indemnité chômage partiel (Covid-19)"
			),

			nextSteps: ['salarié'],
		},
		'comparaison-statuts': {
			tracking: 'comparaison_statut',
			icône: '📊',
			pathId: 'simulateurs.comparaison',
			title: t(
				'pages.simulateurs.comparaison.title',
				'Assistant au choix du statut juridique'
			),
			meta: {
				description: t(
					'pages.simulateurs.comparaison.meta.description',
					'Auto-entrepreneur, indépendant ou dirigeant de SASU ? Avec ce comparatif, trouvez le régime qui vous correspond le mieux'
				),
				title: t(
					'pages.simulateurs.comparaison.meta.title',
					"Création d'entreprise : le comparatif des régimes sociaux"
				),
			},
			shortName: t(
				'pages.simulateurs.comparaison.shortname',
				'Comparaison des statuts'
			),
		},
		'économie-collaborative': {
			tracking: 'economie_collaborative',
			meta: {
				title: t(
					'pages.économie-collaborative.meta.title',
					'Déclaration des revenus des plateforme en ligne : guide intéractif'
				),
				description: t(
					'pages.économie-collaborative.meta.description',
					'Airbnb, Drivy, Blablacar, Leboncoin... Découvrez comment être en règle dans vos déclarations'
				),
			},
			icône: '🙋',
			pathId: 'simulateurs.économieCollaborative.index',
			iframePath: iframeEconomieCollaborativePath,
			shortName: t(
				'pages.économie-collaborative.shortname',
				'Assistant économie collaborative'
			),
			title: t(
				'pages.économie-collaborative.title',
				'Assistant à la déclaration des revenus des plateformes en ligne'
			),
		},
		'choix-statut': {
			tracking: {
				chapter1: 'creer',
				chapter2: 'guide',
			},
			meta: {
				title: t(
					'pages.choix-statut.meta.title',
					'Aide au choix du statut juridique'
				),
				description: t(
					'pages.choix-statut.meta.description',
					'SASU, EURL, auto-entrepreneur, EIRL : choisissez le statut qui vous convient le mieux grâce à cet assistant'
				),
			},
			icône: '📚',
			pathId: 'créer.guideStatut.index',
			title: t(
				'pages.choix-statut.title',
				'Assistant au choix du statut juridique'
			),
			iframePath: iframeChoixStatutPath,
			shortName: t(
				'pages.choix-statut.shortname',
				'Assistant statut juridique'
			),
		},
		'déclaration-charges-sociales-indépendant': {
			tracking: {
				chapter1: 'gerer',
				chapter2: 'declaration_charges_sociales_independant',
			},
			icône: '📑',
			meta: {
				description: t(
					'pages.gérer.declaration_charges_sociales_indépendant.meta.description',
					'Calculez le montant des cotisations et contributions sociales à reporter dans votre déclaration de revenu 2021'
				),
				title: t(
					'pages.gérer.declaration_charges_sociales_indépendant.meta.title',
					'Détermination des charges sociales déductibles'
				),
			},
			pathId: 'gérer.déclaration-charges-sociales-indépendant',
			shortName: t(
				'pages.gérer.declaration_charges_sociales_indépendant.shortname',
				'Détermination des charges sociales déductibles'
			),
			iframePath: iframeChargeSocialesPath,
			title: t(
				'pages.gérer.declaration_charges_sociales_indépendant.title',
				'Assistant à la détermination des charges sociales déductibles'
			),
			nextSteps: ['exonération-covid', 'déclaration-revenu-indépendant-beta'],
		},

		// TODO: Delete "déclaration-revenu-indépendant" object when DRI will no longer be in beta
		'déclaration-revenu-indépendant': {
			tracking: {
				chapter1: 'gerer',
				chapter2: 'declaration_charges_sociales_independant',
			},
			icône: '📑',
			meta: {
				description: t(
					'pages.gérer.declaration_charges_sociales_indépendant.meta.description',
					'Calculez le montant des cotisations et contributions sociales à reporter dans votre déclaration de revenu 2021'
				),
				title: t(
					'pages.gérer.declaration_charges_sociales_indépendant.meta.title',
					'Détermination des charges sociales déductibles'
				),
			},
			pathId: 'gérer.déclarationIndépendant.index',
			shortName: t(
				'pages.gérer.declaration_charges_sociales_indépendant.shortname',
				'Détermination des charges sociales déductibles'
			),
			iframePath: iframeRevenuIndependant,
			title: t(
				'pages.gérer.declaration_charges_sociales_indépendant.title',
				'Assistant à la détermination des charges sociales déductibles'
			),
			nextSteps: ['exonération-covid', 'déclaration-revenu-indépendant-beta'],
		},

		'déclaration-revenu-indépendant-beta': {
			tracking: {
				chapter1: 'gerer',
				chapter2: 'declaration_revenu_independant',
			},
			icône: '✍️',
			iframePath: 'déclaration-revenu-indépendant',
			meta: {
				description: t(
					'pages.gérer.declaration_revenu_indépendant.meta.description',
					'Découvrez quels montants remplir dans quelles cases, et obtenez une estimation des cotisations à payer en 2022'
				),
				title: t(
					'pages.gérer.declaration_revenu_indépendant.meta.title',
					'Assistant à la déclaration de revenu pour les indépendants'
				),
			},
			pathId: 'gérer.déclarationIndépendant.beta.index',
			shortName: t(
				'pages.gérer.declaration_revenu_indépendant.shortname',
				'Assistant déclaration de revenu [beta]'
			),
			title: t(
				'pages.gérer.declaration_revenu_indépendant.title',
				'Assistant à la déclaration de revenu pour les indépendants'
			),
			nextSteps: [
				'exonération-covid',
				'déclaration-charges-sociales-indépendant',
			],
		},
		'demande-mobilité': {
			tracking: {
				chapter1: 'gerer',
				chapter2: 'demande_mobilite',
			},
			icône: '🧳',
			meta: {
				title: t(
					'pages.gérer.demande-mobilité.meta.title',
					'Travailleur indépendant : demande de mobilité en Europe'
				),
				description: t(
					'pages.gérer.demande-mobilité.meta.description',
					"Formulaire interactif à compléter en cas d'exercice d'une activité professionnelle à l'étranger"
				),
			},
			pathId: 'gérer.formulaireMobilité',
			shortName: t(
				'pages.gérer.demande-mobilité.shortname',
				'Demande de mobilité internationale'
			),
			title: t(
				'pages.gérer.demande-mobilité.title',
				'Simulateur de demande de mobilité'
			),
			private: true,
			iframePath: iframeDemandeMobilitePath,
		},
		pharmacien: {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'pharmacien',
			},
			meta: {
				title: t(
					'pages.simulateurs.pharmacien.meta.title',
					'Pharmacien : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.pharmacien.meta.description',
					'Calcul du revenu net après déduction des cotisations à partir du total des recettes pour pharmacien en libéral'
				),
			},
			icône: '⚕️',
			iframePath: iframePharmacienPath,
			pathId: 'simulateurs.profession-libérale.pharmacien',
			shortName: t('pages.simulateurs.pharmacien.shortname', 'Pharmacien'),
			title: t(
				'pages.simulateurs.pharmacien.title',
				'Simulateur de revenus pour pharmacien en libéral'
			),
		},
		médecin: {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'medecin',
			},
			meta: {
				title: t(
					'pages.simulateurs.médecin.meta.title',
					'Médecin : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.médecin.meta.description',
					'Calcul du revenu net après déduction des cotisations à partir du total des recettes. Secteur 1, secteur 2, et dépassement d’honoraire pris en compte'
				),
			},
			icône: '🩺',
			iframePath: iframeMedecinPath,
			pathId: 'simulateurs.profession-libérale.médecin',
			shortName: t('pages.simulateurs.médecin.shortname', 'Médecin'),
			title: t(
				'pages.simulateurs.médecin.title',
				'Simulateur de revenus pour médecin en libéral'
			),
		},
		'chirurgien-dentiste': {
			icône: '🦷',
			meta: {
				title: t(
					'pages.simulateurs.chirurgien-dentiste.meta.title',
					'Chirurgien-dentiste : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.chirurgien-dentiste.meta.description',
					'Calcul du revenu net après cotisations à partir du total des recettes.'
				),
			},
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'chirurgien_dentiste',
			},
			iframePath: iframeChirurgienDentistePath,
			pathId: 'simulateurs.profession-libérale.chirurgien-dentiste',
			shortName: t(
				'pages.simulateurs.chirurgien-dentiste.shortname',
				'Chirurgien-dentiste'
			),
			title: t(
				'pages.simulateurs.chirurgien-dentiste.title',
				'Simulateur de revenus pour chirurgien-dentiste en libéral'
			),
		},
		'sage-femme': {
			icône: '👶',
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'sage_femme',
			},
			meta: {
				title: t(
					'pages.simulateurs.sage-femme.meta.title',
					'Sage-femme : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.sage-femme.meta.description',
					'Calcul du revenu net après cotisations à partir du total des recettes.'
				),
			},
			iframePath: iframeSageFemmePath,
			pathId: 'simulateurs.profession-libérale.sage-femme',
			shortName: t('pages.simulateurs.sage-femme.shortname', 'Sage-femme'),
			title: t(
				'pages.simulateurs.sage-femme.title',
				'Simulateur de revenus pour sage-femme en libéral'
			),
		},
		'auxiliaire-médical': {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'auxiliaire_medical',
			},
			tooltip: t(
				'pages.simulateurs.auxiliaire.tooltip',
				'Infirmiers, masseurs-kinésithérapeutes, pédicures-podologues, orthophonistes et orthoptistes'
			),
			icône: '🩹',
			iframePath: iframeAuxiliaireMedicalPath,
			pathId: 'simulateurs.profession-libérale.auxiliaire',
			shortName: t(
				'pages.simulateurs.auxiliaire.shortname',
				'Auxiliaire médical'
			),
			title: t(
				'pages.simulateurs.auxiliaire.title',
				'Simulateur de revenus pour auxiliaire médical en libéral'
			),
			meta: {
				title: t(
					'pages.simulateurs.auxiliaire-medical.meta.title',
					'Auxiliaire médical : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.auxiliaire-medical.meta.description',
					'Calcul du revenu net après cotisations à partir du total des recettes. Prise en compte des revenus non conventionnés.'
				),
			},
		},
		avocat: {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'avocat',
			},
			icône: '⚖', // j'ai hesité avec 🥑 mais pas envie de me prendre un procès
			iframePath: iframeAvocatPath,
			pathId: 'simulateurs.profession-libérale.avocat',
			shortName: t('pages.simulateurs.avocat.shortname', 'Avocat'),
			title: t(
				'pages.simulateurs.avocat.title',
				'Simulateur de revenus pour avocat en libéral'
			),
			meta: {
				title: t(
					'pages.simulateurs.avocat.meta.title',
					'Avocat : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.avocat.meta.description',
					'Calcul du revenu net après cotisations à partir du total des recettes.'
				),
			},
		},
		'expert-comptable': {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'expert_comptable',
			},
			icône: '🧮',
			iframePath: iframeExpertComptable,
			pathId: 'simulateurs.profession-libérale.expert-comptable',
			shortName: t(
				'pages.simulateurs.expert-comptable.shortname',
				'Expert-Comptable'
			),
			title: t(
				'pages.simulateurs.expert-comptable.title',
				'Simulateur de revenus pour expert comptable et commissaire aux comptes en libéral'
			),
			meta: {
				title: t(
					'pages.simulateurs.expert-comptable.meta.title',
					'Expert-comptable : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.expert-comptable.meta.description',
					'Calcul du revenu net après cotisations à partir du total des recettes.'
				),
			},
		},
		'profession-libérale': {
			tracking: {
				chapter2: 'profession_liberale',
			},
			icône: '💻',
			meta: {
				title: t(
					'pages.simulateurs.profession-libérale.meta.title',
					'Professions libérale : le simulateur Urssaf'
				),
				description: t(
					'pages.simulateurs.profession-libérale.meta.description',
					"Calcul du revenu net pour les indépendants en libéral à l'impôt sur le revenu (IR, BNC)"
				),
			},
			iframePath: iframeProfessionLiberalePath,
			pathId: 'simulateurs.profession-libérale.index',
			shortName: t(
				'pages.simulateurs.profession-libérale.shortname',
				'Profession libérale'
			),
			title: t(
				'pages.simulateurs.profession-libérale.title',
				'Simulateur de revenus pour profession libérale'
			),
		},
		pamc: {
			private: true,
			iframePath: iframePAMCPath,
			tracking: {},
			title: t(
				'pages.simulateurs.pamc.title',

				'Simulateurs de cotisations et de revenu pour les PAMC'
			),
			pathId: 'simulateurs.pamc',
			icône: '🏥',
			meta: {
				title: t(
					'pages.simulateurs.pamc.meta.title',
					'Simulateurs régime PAMC'
				),
				description: t(
					'pages.simulateurs.pamc.meta.description',
					'Calcul du revenu net pour les professions libérales du régime PAMC (médecin, chirurgien-dentiste, sage-femme et auxiliaire médical)'
				),
			},
			shortName: t('pages.simulateurs.pamc.shortname', 'PAMC'),
		},
		is: {
			icône: '🗓',
			tracking: 'impot-societe',
			pathId: 'simulateurs.is',
			iframePath: iframeImpotSocietePath,
			meta: {
				title: t('pages.simulateurs.is.meta.title', 'Impôt sur les sociétés'),
				description: t(
					'pages.simulateurs.is.meta.description',
					'Calculez votre impôt sur les sociétés'
				),
				color: '#E71D66',
			},
			shortName: t('pages.simulateurs.is.meta.title', 'Impôt sur les sociétés'),
			title: t(
				'pages.simulateurs.is.title',
				"Simulateur d'impôt sur les sociétés"
			),

			nextSteps: ['salarié', 'comparaison-statuts'],
		},
		dividendes: {
			icône: '🎩',
			tracking: 'dividendes',
			iframePath: iframeDividendePath,
			pathId: 'simulateurs.dividendes',
			meta: {
				title: t('pages.simulateurs.dividendes.meta.title', 'Dividendes'),
				description: t(
					'pages.simulateurs.dividendes.meta.description',
					"Calculez le montant de l'impôt et des cotisations sur les dividendes versés par votre entreprise."
				),
				color: '#E71D66',
			},
			shortName: t('pages.simulateurs.dividendes.shortName', 'Dividendes'),
			title: t(
				'pages.simulateurs.dividendes.title',
				'Simulateur de versement de dividendes'
			),

			nextSteps: ['salarié', 'is', 'comparaison-statuts'],
		},
		'exonération-covid': {
			icône: '😷',
			tracking: 'exoneration_covid',
			iframePath: iframeExonerationCovid,
			pathId: 'simulateurs.exonération-covid',
			meta: {
				title: t(
					'pages.simulateurs.exonération-covid.meta.title',
					'Exonération de cotisations covid'
				),
				description: t(
					'pages.simulateurs.exonération-covid.meta.description',
					'Déterminez les éléments à déclarer pour bénéficier de l’exonération Covid et obtenir les codes « norme EDI »'
				),
			},
			shortName: t(
				'pages.simulateurs.exonération-covid.shortName',
				'Simulateur d’exonération COVID'
			),
			title: t(
				'pages.simulateurs.exonération-covid.title',
				'Simulateur d’exonération de cotisations Covid pour indépendant'
			),

			nextSteps: ['déclaration-charges-sociales-indépendant'],
		},
	} as const

	return data
}

export type MetadataSrc = ReturnType<typeof metadataSrc>
export default metadataSrc
