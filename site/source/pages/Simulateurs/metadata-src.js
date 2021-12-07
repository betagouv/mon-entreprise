/**
 * Contient l'intégralité des données concernant les différents simulateurs
 * sans dépendance qui compliquerait leur import dans le script de mise à jour
 * des données pour Algolia.
 */
export default ({ t = (_, text) => text } = {}) => {
	return {
		salarié: {
			tracking: 'salarie',
			icône: '🤝',
			title: t(
				'pages.simulateurs.salarié.title',
				'Simulateur de revenus pour salarié'
			),
			iframePath: 'simulateur-embauche',
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
			nextSteps: ['chômage-partiel', 'aides-embauche'],
		},
		'entreprise-individuelle': {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'EI',
			},
			iframePath: 'simulateur-EI',
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
			iframePath: 'simulateur-EIRL',
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

			nextSteps: ['comparaison-statuts'],
		},
		sasu: {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'SASU',
			},
			icône: '📘',
			iframePath: 'simulateur-assimilesalarie',
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
			shortName: t('pages.simulateurs.sasu.shortname', 'SASU'),
			title: t('pages.simulateurs.sasu.title', 'Simulateur de SASU'),
			nextSteps: ['is', 'comparaison-statuts'],
		},
		eurl: {
			tracking: {
				chapter2: 'statut_entreprise',
				chapter3: 'EURL',
			},
			icône: '📕',
			iframePath: 'simulateur-eurl',
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
			title: t('pages.simulateurs.eurl.title', "Simulateur d'EURL"),
			nextSteps: ['is', 'comparaison-statuts'],
		},
		'auto-entrepreneur': {
			tracking: 'auto_entrepreneur',
			icône: '🚶‍♂️',
			iframePath: 'simulateur-autoentrepreneur',
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
			iframePath: 'simulateur-independant',
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
			nextSteps: ['comparaison-statuts', 'is'],
		},

		'artiste-auteur': {
			icône: '👩‍🎨',
			tracking: 'artiste-auteur',
			iframePath: 'simulateur-artiste-auteur',
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
				'Estimer mes cotisations d’artiste-auteur'
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
			iframePath: 'simulateur-chomage-partiel',
			meta: {
				description: t(
					'pages.simulateurs.chômage-partiel.meta.description',
					"Calcul du revenu net pour l'employé et du reste à charge pour l'employeur après remboursement de l'Etat, en prenant en compte toutes les cotisations sociales."
				),
				ogDescription: t(
					'pages.simulateurs.chômage-partiel.meta.ogDescription',
					"Accédez à une première estimation en saisissant à partir d'un salaire brut. Vous pourrez ensuite personaliser votre situation (temps partiel, convention, etc). Prends en compte la totalité des cotisations, y compris celles spécifiques à l'indemnité (CSG et CRDS)."
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
				'Covid-19 : Simulateur de chômage partiel'
			),

			nextSteps: ['salarié', 'aides-embauche'],
		},
		'comparaison-statuts': {
			tracking: 'comparaison_statut',
			icône: '📊',
			pathId: 'simulateurs.comparaison',
			title: t(
				'pages.simulateurs.comparaison.title',
				'Indépendant, assimilé salarié ou auto-entrepreneur : quel régime choisir ?'
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
			iframePath: 'economie-collaborative',
			shortName: t(
				'pages.économie-collaborative.shortname',
				'Assistant économie collaborative'
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
			iframePath: 'choix-statut-juridique',
			shortName: t(
				'pages.économie-collaborative.shortname',
				'Assistant statut juridique'
			),
		},
		'aide-déclaration-indépendant': {
			tracking: {
				chapter1: 'gerer',
				chapter2: 'aide_declaration_independant',
			},
			icône: '✍️',
			meta: {
				description: t(
					'pages.gérer.aide-déclaration-indépendant.meta.description',
					'Calculer facilement les montants des charges sociales à reporter dans votre déclaration de revenu 2020.'
				),
				title: t(
					'pages.gérer.aide-déclaration-indépendant.meta.title',
					'Déclaration de revenus indépendant : calcul du montant des cotisations'
				),
			},
			pathId: 'simulateurs.déclarationIndépendant',
			shortName: t(
				'pages.gérer.aide-déclaration-indépendant.shortname',
				'Aide à la déclaration de revenu'
			),
			title: t(
				'pages.gérer.aide-déclaration-indépendant.title',
				"Aide à la déclaration de revenus au titre de l'année 2020"
			),
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
			private: true,
			iframePath: 'demande-mobilite',
		},
		pharmacien: {
			tracking: {
				chapter2: 'profession_liberale',
				chapter3: 'pharmacien',
			},
			meta: {
				title: t(
					'pages.simulateurs.médecin.meta.title',
					'Pharmacien : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.médecin.meta.description',
					'Calcul du revenu net après déduction des cotisations à partir du total des recettes pour pharmacien en libéral'
				),
			},
			icône: '⚕️',
			iframePath: 'pharmacien',
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
			iframePath: 'médecin',
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
			iframePath: 'chirurgien-dentiste',
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
			iframePath: 'sage-femme',
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
			iframePath: 'auxiliaire-medical',
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
			iframePath: 'avocat',
			pathId: 'simulateurs.profession-libérale.avocat',
			shortName: t('pages.simulateurs.avocat.shortname', 'Avocat'),
			title: t(
				'pages.simulateurs.avocat.title',
				'Simulateur de revenus pour avocat en libéral'
			),
			meta: {
				title: t(
					'pages.simulateurs.auxiliaire-medical.meta.title',
					'Avocat : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.auxiliaire-medical.meta.description',
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
			iframePath: 'expert-comptable',
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
					'pages.simulateurs.auxiliaire-medical.meta.title',
					'Expert-comptable : simulateur de revenus'
				),
				description: t(
					'pages.simulateurs.auxiliaire-medical.meta.description',
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
			iframePath: 'profession-liberale',
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
			iframePath: 'pamc',
			tracking: {},
			title: t(
				'pages.simulateurs.pamc.title',

				'PAMC : simulateurs de cotisations et de revenu'
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
		'aides-embauche': {
			icône: '🎁',
			tracking: 'aides_embauche',
			meta: {
				title: t(
					'pages.simulateurs.aides-embauche.meta.title',
					'Aides à l’embauche'
				),
				description: t(
					'pages.simulateurs.aides-embauche.meta.description',
					'Découvrez les principales aides à l’embauche et estimez leur montant en répondant à quelques questions.'
				),
				color: '#11965f',
			},
			pathId: 'simulateurs.aide-embauche',
			iframePath: 'aides-embauche',
			shortName: t(
				'pages.simulateurs.aides-embauche.meta.title',
				'Aides à l’embauche'
			),
			title: t(
				'pages.simulateurs.aides-embauche.meta.title',
				'Aides à l’embauche'
			),
			description: t(
				'pages.simulateurs.aides-embauche.introduction',
				"Les employeurs peuvent bénéficier d'une aide financière pour l'embauche de certains publics prioritaires. Découvrez les dispositifs existants et estimez le montant de l'aide en répondant aux questions."
			),
			nextSteps: ['salarié'],
		},
		is: {
			icône: '🗓',
			tracking: 'impot-societe',
			pathId: 'simulateurs.is',
			iframePath: 'impot-societe',
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
			iframePath: 'dividendes',
			pathId: 'simulateurs.dividendes',
			meta: {
				title: t('pages.simulateurs.dividendes.meta.title', 'Dividendes'),
				description: t(
					'pages.simulateurs.dividendes.meta.description',
					"Calculez le montant de l'impôt et des cotisations sur les dividendes versés par votre entreprise."
				),
				color: '#E71D66',
			},
			shortName: t('pages.simulateurs.dividendes.meta.title', 'Dividendes'),
			title: t(
				'pages.simulateurs.dividendes.title',
				'Simulateur de versement de dividendes'
			),

			nextSteps: ['salarié', 'is', 'comparaison-statuts'],
		},
	}
}
