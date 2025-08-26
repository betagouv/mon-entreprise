import { checkA11Y, fr } from '../../../support/utils'

const idPrefix = 'déclaration_revenus_PAMC__'
const structureDeSoins = 'activité_en_structures_de_soins'
const exonerations = 'déductions_et_exonérations'
const autresRevenus = 'autres_revenus_non_salariés'
const revenusNets = 'revenus_nets__'

describe(`L'assistant à la déclaration de revenu pour PAMC`, function () {
	if (!fr) {
		return
	}

	beforeEach(function () {
		cy.visit('/assistants/declaration-revenus-pam')
	})

	it("devrait s'afficher", function () {
		cy.get('h1')
			.contains('Assistant à la déclaration de revenus pour les PAMC')
			.should('be.visible')
	})

	it('devrait demander la profession', function () {
		cy.get('h2').contains('Profession').should('be.visible')
		cy.contains('Quelle est votre profession ?').should('be.visible')
	})

	it('devrait demander le statut une fois la profession sélectionnée', function () {
		cy.contains(
			'Quel était votre statut d’exercice au 1er janvier ou à votre date de début d’activité ?'
		).should('not.exist')

		cy.contains('Sage-femme').click()

		cy.contains(
			'Quel était votre statut d’exercice au 1er janvier ou à votre date de début d’activité ?'
		).should('be.visible')
	})

	it('devrait demander le régime fiscal une fois le statut sélectionné', function () {
		cy.contains('Sage-femme').click()
		cy.get('h2').contains('Rrégime fiscal').should('not.exist')
		cy.contains('Quel est votre régime fiscal ?').should('not.exist')

		cy.contains('Titulaire').click()

		cy.get('h2').contains('Régime fiscal').should('be.visible')
		cy.contains('Quel est votre régime fiscal ?').should('be.visible')
		cy.contains('Impôt sur le revenu - régime micro-fiscal').should(
			'be.visible'
		)
		cy.contains(
			'Impôt sur le revenu - régime de la déclaration contrôlée'
		).should('be.visible')
		cy.contains('Impôt sur les sociétés').should('be.visible')
	})

	it("ne devrait pas montrer les champs avant qu'un régime fiscal soit sélectionné", function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()

		cy.get('h2').as('titles')

		cy.get('@titles').contains('Recettes').should('not.exist')
		cy.contains('Recettes brutes totales').should('not.exist')
		cy.contains('Revenus imposables').should('not.exist')
		cy.contains('Revenus des associés et gérants').should('not.exist')
		cy.contains('Dividendes').should('not.exist')
		cy.contains('Frais réels hors intérêt d’emprunts').should('not.exist')
		cy.contains('Cotisations sociales obligatoires').should('not.exist')

		cy.get('@titles').contains('Données du relevé SNIR').should('not.exist')
		cy.contains('Honoraires tirés d’actes conventionnés').should('not.exist')
		cy.contains('Dépassements d’honoraires').should('not.exist')
		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.contains('Taux Urssaf').should('not.exist')

		cy.get('@titles').contains('Structures de soins').should('not.exist')
		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('not.exist')
		cy.contains('Montant').should('not.exist')

		cy.get('@titles').contains('Déductions et exonérations').should('not.exist')
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		).should('not.exist')
		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.contains('Revenus exonérés').should('not.exist')
		cy.contains('Plus-values à court terme exonérées').should('not.exist')
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('not.exist')

		cy.get('@titles')
			.contains('Autres revenus non salariés')
			.should('not.exist')
		cy.contains('Avez-vous des revenus non salariés autres que ceux ').should(
			'not.exist'
		)
		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'not.exist'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'not.exist'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('not.exist')
		cy.contains('Bénéfice/déficit BIC').should('not.exist')
		cy.contains('Bénéfice/déficit agricole').should('not.exist')

		cy.get('@titles').contains('Actes conventionnés').should('not.exist')
		cy.contains(
			'Avez-vous effectué uniquement des actes conventionnés ?'
		).should('not.exist')

		cy.get('@titles').contains('Cotisations facultatives').should('not.exist')
		cy.contains('Montant de vos cotisations facultatives').should('not.exist')

		cy.get('@titles').contains('Revenus de remplacement').should('not.exist')
		cy.contains(
			'Avez-vous perçu des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		).should('not.exist')
		cy.contains(
			'Montant des indemnités journalières versées par la CPAM'
		).should('not.exist')
		cy.contains(
			'Montant des indemnités d’incapacité temporaire versées par la caisse retraite'
		).should('not.exist')
		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
	})

	it("devrait montrer les champs lorsqu'un régime fiscal est sélectionné", function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get('h2').as('titles')

		cy.get('@titles').contains('Recettes').should('be.visible')
		cy.contains('Recettes brutes totales').should('be.visible')
		cy.get(`#${idPrefix}_recettes_brutes_totales-input`).should('be.visible')
		cy.contains('Revenus imposables').should('be.visible')
		cy.get(`#${idPrefix}_revenus_imposables-input`).should('be.visible')
		cy.contains('Cotisations sociales obligatoires').should('be.visible')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires-input`).should(
			'be.visible'
		)

		cy.get('@titles').contains('Données du relevé SNIR').should('be.visible')
		cy.contains('Honoraires tirés d’actes conventionnés').should('be.visible')
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-input`).should(
			'be.visible'
		)
		cy.contains('Dépassements d’honoraires').should('be.visible')
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-input`).should(
			'be.visible'
		)

		cy.get('@titles').contains('Structures de soins').should('be.visible')
		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('be.visible')
		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		)
			.parent()
			.parent()
			.contains('Oui')

		cy.get('@titles')
			.contains('Déductions et exonérations')
			.should('be.visible')
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		).should('be.visible')
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')

		cy.get('@titles')
			.contains('Autres revenus non salariés')
			.should('be.visible')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		).should('be.visible')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		)
			.parent()
			.parent()
			.contains('Oui')

		cy.get('@titles').contains('Actes conventionnés').should('be.visible')
		cy.contains(
			'Avez-vous effectué uniquement des actes conventionnés ?'
		).should('be.visible')
		cy.contains('Avez-vous effectué uniquement des actes conventionnés ?')
			.parent()
			.parent()
			.contains('Oui')

		cy.get('@titles').contains('Revenus de remplacement').should('be.visible')
		cy.contains(
			'Avez-vous perçu des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		).should('be.visible')
		cy.contains(
			'Avez-vous perçu des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		)
			.parent()
			.parent()
			.contains('Oui')
	})

	it('devrait effacer les réponses en cliquant sur réinitialiser', function () {
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Réinitialiser').click()

		cy.contains('Recettes brutes totales').should('not.exist')
	})

	it('devrait afficher un conseil selon le régime fiscal sélectionné', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()

		cy.contains('micro-fiscal').click()
		cy.contains('Afin de faciliter le remplissage, préparez :').should(
			'be.visible'
		)

		cy.contains('régime de la déclaration contrôlée').click()
		cy.contains(
			'Afin de faciliter le remplissage, munissez-vous des annexes A et B de votre liasse fiscale 2035.'
		).should('be.visible')

		cy.contains('Impôt sur les sociétés').click()
		cy.contains(
			'Afin de faciliter le remplissage, munissez-vous de votre liasse fiscale 2065.'
		).should('be.visible')
	})

	it("devrait afficher des champs de revenus différents pour l'IS", function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('Impôt sur les sociétés').click()

		cy.contains('Recettes brutes totales').should('be.visible')
		cy.get(`#${idPrefix}_recettes_brutes_totales-input`).should('be.visible')
		cy.contains('Revenus des associés et gérants').should('be.visible')
		cy.get(`#${idPrefix}_revenus_des_associés_et_gérants-input`).should(
			'be.visible'
		)
		cy.contains('Dividendes').should('be.visible')
		cy.get(`#${idPrefix}_dividendes-input`).should('be.visible')
		cy.contains('Frais réels hors intérêt d’emprunts').should('be.visible')
		cy.get(`#${idPrefix}_frais_réels-input`).should('be.visible')
		cy.contains('Cotisations sociales obligatoires').should('be.visible')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires-input`).should(
			'be.visible'
		)

		cy.contains('Revenus imposables').should('not.exist')
		cy.get(`#${idPrefix}_revenus_imposables`).should('not.exist')
	})

	it('ne devrait pas afficher les cotisations facultatives dans le formulaire pour le régime micro-fiscal', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('h2').contains('Cotisations facultatives').should('not.exist')
		cy.contains('Montant de vos cotisations facultatives').should('not.exist')

		cy.contains('régime de la déclaration contrôlée').click()
		cy.get('h2').contains('Cotisations facultatives').should('be.visible')
		cy.contains('Montant de vos cotisations facultatives').should('be.visible')

		cy.contains('Impôt sur les sociétés').click()
		cy.get('h2').contains('Cotisations facultatives').should('be.visible')
		cy.contains('Montant de vos cotisations facultatives').should('be.visible')
	})

	it('devrait formuler la question sur les autres revenus différemment selon le régime fiscal', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()

		cy.contains('micro-fiscal').click()
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant des BNC ?'
		).should('not.exist')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant de l’impôt sur les sociétés ?'
		).should('not.exist')

		cy.contains('régime de la déclaration contrôlée').click()
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		).should('not.exist')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant des BNC ?'
		).should('be.visible')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant de l’impôt sur les sociétés ?'
		).should('not.exist')

		cy.contains('Impôt sur les sociétés').click()
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		).should('not.exist')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant des BNC ?'
		).should('not.exist')
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant de l’impôt sur les sociétés ?'
		).should('be.visible')
	})

	it('ne devrait pas montrer les résultats avant que les champs soient remplis', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get('h2')
			.contains('Montants à reporter dans votre déclaration de revenus')
			.should('not.exist')

		cy.get('h3').as('titles')

		cy.contains(
			'Situation au 1er janvier ou à la date du début d’activité'
		).should('not.exist')
		cy.contains('Vous êtes titulaire').should('not.exist')
		cy.contains('Vous êtes remplaçant').should('not.exist')

		cy.contains(
			'Recettes brutes totales tirées des activités non salariées'
		).should('not.exist')
		cy.get(`#${idPrefix}_recettes_brutes_totales-value`).should('not.exist')

		cy.get('@titles')
			.contains('Montant des revenus de remplacement')
			.should('not.exist')

		cy.get('@titles').contains('Déductions et exonérations').should('not.exist')
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)

		cy.get('@titles')
			.contains('Cotisations sociales obligatoires')
			.should('not.exist')
		cy.contains(
			'Cotisations sociales obligatoires déduites du résultat imposable'
		).should('not.exist')

		cy.get('@titles')
			.contains('Répartition des revenus nets')
			.should('not.exist')
		cy.contains('Revenus nets de l’activité conventionnée').should('not.exist')
		cy.contains('Bénéfice').should('not.exist')
		cy.contains('Déficit').should('not.exist')
		cy.contains('Revenus nets tirés des autres activités non salariées').should(
			'not.exist'
		)
		cy.contains(
			'Dont revenus nets de l’activité réalisée dans des structures de soins'
		).should('not.exist')

		cy.contains('Données transmises par l’Assurance Maladie').should(
			'not.exist'
		)

		cy.contains('Imprimer ou sauvegarder en PDF').should('not.exist')
	})

	it('devrait montrer les résultats lorsque les champs sont remplis', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 5)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get('h2')
			.contains('Montants à reporter dans votre déclaration de revenus')
			.should('be.visible')

		cy.get('h3').as('titles')

		cy.contains(
			'Situation au 1er janvier ou à la date du début d’activité'
		).should('be.visible')
		cy.contains('Vous êtes titulaire').should('be.visible')
		cy.contains('Vous êtes remplaçant').should('be.visible')
		cy.get(`[id="${idPrefix}_statut_=_'titulaire'-value"]`).should('be.visible')
		cy.get(`[id="${idPrefix}_statut_=_'remplaçant'-value"]`).should(
			'be.visible'
		)

		cy.contains(
			'Recettes brutes totales tirées des activités non salariées'
		).should('be.visible')
		cy.get(`#${idPrefix}_recettes_brutes_totales-value`).should('be.visible')

		cy.get('@titles')
			.contains('Cotisations sociales obligatoires')
			.should('be.visible')
		cy.contains(
			'Cotisations sociales obligatoires déduites du résultat imposable'
		).should('be.visible')
		cy.get(`#${idPrefix}_cotisations_sociales_obligatoires-value`).should(
			'be.visible'
		)

		cy.contains('Répartition des revenus nets').should('be.visible')
		cy.contains('Revenus nets de l’activité conventionnée').should('be.visible')
		cy.get(`#${idPrefix}_${revenusNets}_revenus_conventionnés-value`).should(
			'be.visible'
		)
		cy.contains('Revenus nets tirés des autres activités non salariées').should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_non_conventionnés-value`
		).should('be.visible')

		cy.contains('Données transmises par l’Assurance Maladie').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-value`).should(
			'be.visible'
		)

		cy.contains('Imprimer ou sauvegarder en PDF').should('be.visible')
	})

	it('ne devrait pas afficher les cotisations facultatives dans les résultats pour le régime micro-fiscal', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.get('h3').contains('Cotisations facultatives').should('not.exist')
		cy.get(`#${idPrefix}_cotisations_facultatives-label`).should('not.exist')
		cy.get(`#${idPrefix}_cotisations_facultatives-value`).should('not.exist')

		cy.contains('régime de la déclaration contrôlée').click()
		cy.get('h3').contains('Cotisations facultatives').should('be.visible')
		cy.get(`#${idPrefix}_cotisations_facultatives-label`).should('be.visible')
		cy.get(`#${idPrefix}_cotisations_facultatives-value`).should('be.visible')

		cy.contains('Impôt sur les sociétés').click()
		cy.get('h3').contains('Cotisations facultatives').should('be.visible')
		cy.get(`#${idPrefix}_cotisations_facultatives-label`).should('be.visible')
		cy.get(`#${idPrefix}_cotisations_facultatives-value`).should('be.visible')
	})

	it('devrait montrer des champs différents aux dentistes', function () {
		// Non dentiste
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf`).should('not.exist')

		// Dentiste
		cy.contains('Chirurgien/chirurgienne-dentiste').click()

		cy.get(`#${idPrefix}_SNIR___taux_urssaf-title`).should('be.visible')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-input`).should('be.visible')

		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		).should('not.exist')
		cy.get(`#${idPrefix}_${structureDeSoins}`).should('not.exist')
	})

	it('devrait montrer des résultats différents aux dentistes', function () {
		// Non dentiste
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Taux Urssaf').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-value`).should('not.exist')

		// Dentiste
		cy.contains('Chirurgien/chirurgienne-dentiste').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 6)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_SNIR___taux_urssaf-label`).should('be.visible')
		cy.get(`#${idPrefix}_SNIR___taux_urssaf-value`).should('be.visible')

		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_remboursables-value`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-label`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___dépassements_honoraires-value`).should(
			'not.exist'
		)
	})

	it('devrait montrer des champs différents aux médecins', function () {
		// Non médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits`).should('not.exist')

		// Médecin
		cy.contains('Médecin').click()

		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-input`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-input`).should(
			'be.visible'
		)
	})

	it('devrait montrer des résultats différents aux médecins', function () {
		// Non médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Honoraires aux tarifs opposables hors forfaits').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-value`).should(
			'not.exist'
		)
		cy.contains('Honoraires totaux hors forfaits').should('not.exist')
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-value`).should(
			'not.exist'
		)

		// Médecin
		cy.contains('Médecin').click()
		cy.get('input[type="text"]').as('inputs').should('have.length', 7)
		cy.get('@inputs').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_tarifs_opposables-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_SNIR___honoraires_hors_forfaits-value`).should(
			'be.visible'
		)
	})

	it('devrait montrer la question sur les actes conventionnés conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Pédicure podologue').click()
		cy.contains('Remplaçant').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Avez-vous effectué uniquement des actes conventionnés ?')
			.as('questionLabel')
			.should('be.visible')

		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.get('@questionLabel').should('not.exist')

		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		// "oui" à structure de soins et "non" à autres revenus
		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get('@questionLabel').should('not.exist')

		// "oui" à structure de soins et "oui" à autres revenus
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get('@questionLabel').should('not.exist')

		// "non" à structure de soins et "oui" à autres revenus
		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		)
			.parent()
			.parent()
			.contains('Non')
			.click()

		cy.get('@questionLabel').should('not.exist')
	})

	it('devrait montrer le champ pour les activités en structures de soins conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.get(`#${idPrefix}_${structureDeSoins}___recettes-title`).should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${structureDeSoins}___recettes`).should('not.exist')

		cy.contains(
			'Avez-vous des recettes issues d’une activité en structure de soins ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get(`#${idPrefix}_${structureDeSoins}___recettes-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${structureDeSoins}___recettes-input`).should(
			'be.visible'
		)
		cy.contains(
			'Dont revenus nets de l’activité réalisée dans des structures de soins'
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${revenusNets}_revenus_structures_de_soins-value`
		).should('be.visible')
	})

	it('devrait montrer les champs pour les déductions et exonérations conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains('Revenus exonérés').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___revenus_exonérés`).should(
			'not.exist'
		)
		cy.contains('Plus-values à court terme exonérées').should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___plus-values_à_court_terme`).should(
			'not.exist'
		)
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances`).should(
			'not.exist'
		)
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains('Revenus exonérés').should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___revenus_exonérés-input`).should(
			'be.visible'
		)
		cy.contains('Plus-values à court terme exonérées').should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___plus-values_à_court_terme-input`
		).should('be.visible')
		cy.contains(
			'Montant des chèques vacances déduits du revenu imposable'
		).should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-input`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${exonerations}___chèques_vacances-value`).should(
			'be.visible'
		)
	})

	it("devrait montrer un champ d'exonération supplémentaire aux médecins au régime micro-fiscal", function () {
		// Non médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('not.exist')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('not.exist')
		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III`).should(
			'not.exist'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'not.exist'
		)

		// Médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-input`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('be.visible')

		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III`).should(
			'not.exist'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'not.exist'
		)
	})

	it("devrait montrer deux champs d'exonération supplémentaires aux médecins au régime de la déclaration contrôlée", function () {
		// Non médecin au régime de la déclaration controlée
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('régime de la déclaration contrôlée').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('not.exist')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('not.exist')
		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III`).should(
			'not.exist'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'not.exist'
		)

		// Médecin au régime de la déclaration contrôlée
		cy.contains('Réinitialiser').click()
		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('régime de la déclaration contrôlée').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-input`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('be.visible')
		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('be.visible')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-input`).should(
			'be.visible'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'be.visible'
		)
	})

	it("devrait montrer un champ d'exonération supplémentaire aux médecins à l'IS", function () {
		// Non médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('Impôt sur les sociétés').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains('Exonération zone déficitaire en offre de soins').should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins`
		).should('not.exist')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('not.exist')
		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III`).should(
			'not.exist'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'not.exist'
		)

		// Médecin
		cy.contains('Réinitialiser').click()
		cy.contains('Médecin').click()
		cy.contains('Titulaire').click()
		cy.contains('Impôt sur les sociétés').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Bénéficiez-vous de déductions et/ou de revenus exonérés fiscalement ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-input`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_${exonerations}___zone_déficitaire_en_offre_de_soins-value`
		).should('be.visible')

		cy.contains(
			'Déduction du groupe III et déduction complémentaire 3%'
		).should('not.exist')
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III`).should(
			'not.exist'
		)
		cy.contains('Médecin secteur 1 - déduction complémentaire 3%').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${exonerations}___déduction_groupe_III-value`).should(
			'not.exist'
		)
	})

	it('devrait montrer les champs pour les autres revenus non salariés conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('not.exist')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises`).should(
			'not.exist'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service`).should(
			'not.exist'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA`).should('not.exist')
		cy.contains('Bénéfice/déficit BIC').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___BIC`).should('not.exist')
		cy.contains('Bénéfice/déficit agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___agricole`).should('not.exist')

		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant du régime micro-BNC ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains('Plus-values nettes à court terme').should('be.visible')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme-input`
		).should('be.visible')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises-input`
		).should('be.visible')
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service-input`).should(
			'be.visible'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA-input`).should(
			'be.visible'
		)
	})

	it('devrait montrer uniquement les champs des autres revenus non salariés relevant du régime micro-fiscal lorsque le régime micro-fiscal est sélectionné', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()

		cy.contains('Bénéfice/déficit BIC').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___BIC`).should('not.exist')
		cy.contains('Bénéfice/déficit agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___agricole`).should('not.exist')
	})

	it('devrait montrer uniquement les champs des autres revenus non salariés relevant du régime général lorsque le régime de la déclaration contrôlée est sélectionné', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('régime de la déclaration contrôlée').click()

		// Question
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant des BNC ?'
		).should('be.visible')

		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant des BNC ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		// Champs présents
		cy.contains('Bénéfice/déficit BIC').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___BIC-input`).should('be.visible')
		cy.contains('Bénéfice/déficit agricole').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___agricole-input`).should(
			'be.visible'
		)

		// Champs absents
		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('not.exist')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises`).should(
			'not.exist'
		)
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'not.exist'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service`).should(
			'not.exist'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('not.exist')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA`).should('not.exist')
	})

	it("devrait montrer tous les champs des autres revenus non salariés (sauf les plus-values) lorsque l'IS est sélectionné", function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('Impôt sur les sociétés').click()

		// Question
		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant de l’impôt sur les sociétés ?'
		).should('be.visible')

		cy.contains(
			'Avez-vous des revenus non salariés autres que ceux relevant de l’impôt sur les sociétés ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		// Champs présents
		cy.contains('Bénéfice/déficit BIC').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___BIC-input`).should('be.visible')
		cy.contains('Micro-BIC : chiffre d’affaires vente de marchandises').should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_${autresRevenus}___micro-BIC_marchandises-input`
		).should('be.visible')
		cy.contains('Micro-BIC : chiffre d’affaires prestation de service').should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BIC_service-input`).should(
			'be.visible'
		)
		cy.contains('Bénéfice/déficit agricole').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___agricole-input`).should(
			'be.visible'
		)
		cy.contains('Micro-BA : chiffre d’affaires agricole').should('be.visible')
		cy.get(`#${idPrefix}_${autresRevenus}___micro-BA-input`).should(
			'be.visible'
		)

		// Champ absent
		cy.contains('Plus-values nettes à court terme').should('not.exist')
		cy.get(
			`#${idPrefix}_${autresRevenus}___plus-values_nettes_à_court_terme`
		).should('not.exist')
	})

	it('devrait montrer le champ pour les revenus de remplacement conditionnellement', function () {
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})

		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA`).should('not.exist')
		cy.get('h3')
			.contains('Montant des revenus de remplacement')
			.should('not.exist')
		cy.contains(
			'Montant des allocations journalières du proche aidant (AJPA) versées par la CAF'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'not.exist'
		)

		cy.contains(
			'Avez-vous perçu des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-input`).should(
			'be.visible'
		)
		cy.get('h3')
			.contains('Montant des revenus de remplacement')
			.should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'be.visible'
		)
	})

	it('devrait afficher deux champs de revenus de remplacement supplémentaires pour les régimes autres que le micro-fiscal', function () {
		// Régime micro-fiscal
		cy.contains('Réinitialiser').click()
		cy.contains('Sage-femme').click()
		cy.contains('Titulaire').click()
		cy.contains('micro-fiscal').click()
		cy.get('input[type="text"]').each(($input) => {
			cy.wrap($input).type('{selectall}100')
		})
		cy.contains(
			'Avez-vous perçu des indemnités de la Caf, de la CPAM ou de votre caisse de retraite ?'
		)
			.parent()
			.parent()
			.contains('Oui')
			.click()

		cy.contains(
			'Montant des indemnités journalières versées par la CPAM'
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ`).should('not.exist')
		cy.contains(
			'Montant des indemnités d’incapacité temporaire versées par la caisse retraite'
		).should('not.exist')
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire`
		).should('not.exist')
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-value`).should(
			'not.exist'
		)
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-value`
		).should('not.exist')

		// Régime de la déclaration contrôlée
		cy.contains('régime de la déclaration contrôlée').click()

		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-input`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-input`).should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-input`
		).should('be.visible')
		cy.get('h3')
			.contains('Montant des revenus de remplacement')
			.should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-value`
		).should('be.visible')

		// IS
		cy.contains('Impôt sur les sociétés').click()

		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-input`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-title`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-input`).should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-title`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-input`
		).should('be.visible')
		cy.get('h3')
			.contains('Montant des revenus de remplacement')
			.should('be.visible')
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___IJ-value`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-label`).should(
			'be.visible'
		)
		cy.get(`#${idPrefix}_revenus_de_remplacement___AJPA-value`).should(
			'be.visible'
		)
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-label`
		).should('be.visible')
		cy.get(
			`#${idPrefix}_revenus_de_remplacement___indemnités_incapacité_temporaire-value`
		).should('be.visible')
	})

	it('devrait être accessible', function () {
		checkA11Y()
	})
})
