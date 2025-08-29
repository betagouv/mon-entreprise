import { checkA11Y, fr } from '../../../support/utils'

describe('Assistant choix du statut', { testIsolation: false }, function () {
	if (!fr) {
		return
	}

	const simulateurBaseUrl = '/assistants/choix-du-statut'

	before(function () {
		cy.visit(simulateurBaseUrl)
		cy.clearAllLocalStorage()
	})

	describe('La page d’accueil', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})

		it('devrait permettre de démarrer l’assistant', function () {
			cy.contains('Trouver le bon statut').click()
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + simulateurBaseUrl + '/recherche-activite'
			)
		})
	})

	describe(
		'La page sélection d’activité',
		{ testIsolation: false },
		function () {
			it('devrait s’afficher', function () {
				cy.contains('Choisir votre statut')
				cy.contains('Mon activité principale est...')
			})

			it('devrait respecter le RGAA', function () {
				checkA11Y()
			})

			it('devrait permettre de chercher une activité', function () {
				cy.get('input[type=search]').type('coiff')
				cy.contains('Coiffure')
			})

			it('devrait respecter le RGAA pendant la recherche', function () {
				checkA11Y()
			})

			it('devrait permettre de sélectionner une activité', function () {
				cy.contains('Coiffure').click()
				cy.contains('Enregistrer et continuer').not('[disabled]')
			})

			it('devrait respecter le RGAA après la sélection', function () {
				checkA11Y()
			})

			it('devrait permettre d’aller à l’étape suivante', function () {
				cy.contains('Enregistrer et continuer').click()
				cy.url().should(
					'eq',
					Cypress.config().baseUrl + simulateurBaseUrl + '/details-activite'
				)
			})
		}
	)

	describe(
		'La page confirmation d’activité',
		{ testIsolation: false },
		function () {
			it('devrait s’afficher', function () {
				cy.contains('Choisir votre statut')
				cy.contains('Précisions sur votre activité')
			})

			it('devrait respecter le RGAA', function () {
				checkA11Y()
			})

			it('devrait permettre d’aller à l’étape suivante', function () {
				cy.contains('Continuer avec cette activité').not('[disabled]').click()
				cy.url().should(
					'eq',
					Cypress.config().baseUrl + simulateurBaseUrl + '/commune'
				)
			})
		}
	)

	describe(
		'La page sélection de commune',
		{ testIsolation: false },
		function () {
			it('devrait s’afficher', function () {
				cy.contains('Choisir votre statut')
				cy.contains('Dans quelle commune voulez-vous créer votre entreprise ?')
			})

			it('devrait respecter le RGAA', function () {
				checkA11Y()
			})

			it('devrait permettre de chercher une commune', function () {
				cy.get('input[aria-autocomplete="list"]').type('saint rémy en b')
				cy.contains('Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson')
			})

			it('devrait respecter le RGAA pendant la recherche', function () {
				checkA11Y()
			})

			it('devrait permettre de sélectionner une commune', function () {
				cy.contains('Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson').click()
				cy.contains('Enregistrer et continuer').not('[disabled]')
			})

			it('devrait respecter le RGAA après la sélection', function () {
				checkA11Y()
			})

			it('devrait permettre d’aller à l’étape suivante', function () {
				cy.contains('Enregistrer et continuer').click()
				cy.url().should(
					'eq',
					Cypress.config().baseUrl + simulateurBaseUrl + '/association'
				)
			})
		}
	)

	describe('La page association', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
			cy.contains('Je crée cette activité...')
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})

		it('devrait permettre de spécifier s’il s’agit d’une association ou pas', function () {
			cy.contains("Dans le but de gagner de l'argent").click()
			cy.contains('Enregistrer et continuer').not('[disabled]')
		})

		it('devrait respecter le RGAA après la sélection d’une option', function () {
			checkA11Y()
		})

		it('devrait permettre d’aller à l’étape suivante', function () {
			cy.contains('Enregistrer et continuer').click()
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + simulateurBaseUrl + '/associe'
			)
		})
	})

	describe('La page associés', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
			cy.contains('Je gère cette entreprise...')
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})

		it('devrait permettre de renseigner des associé⋅es', function () {
			cy.contains('Seul / seule').click()
			cy.contains(
				'Envisagez-vous d’ajouter des associé(e)s dans un second temps ?'
			)
			cy.contains('Oui').click()
			cy.contains('Enregistrer et continuer').not('[disabled]')
		})

		it('devrait respecter le RGAA après renseignement d’associé⋅es', function () {
			checkA11Y()
		})

		it('devrait permettre d’aller à l’étape suivante', function () {
			cy.contains('Enregistrer et continuer').click()
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + simulateurBaseUrl + '/remuneration'
			)
		})
	})

	describe('La page rémunération', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
			cy.contains("La première année, j'estime mon chiffre d'affaires à...")
			cy.contains("J'estime mes charges professionnelles à...")
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})

		it('devrait permettre de renseigner un chiffre d’affaires et des charges', function () {
			cy.get('input[id="CA"]').type('{selectall}50000')
			cy.contains('Enregistrer et continuer').not('[disabled]')
			cy.get('#charges').type('{selectall}10000')
		})

		it('devrait respecter le RGAA après remplissage', function () {
			checkA11Y()
		})

		it('devrait permettre d’accéder au comparateur', function () {
			cy.contains('Enregistrer et continuer').click()
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + simulateurBaseUrl + '/comparateur'
			)
		})
	})

	describe('La page du comparateur', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
			cy.contains('Comparer...')
			cy.contains('Tout déplier').click()
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})

		it('devrait permettre de sélectionner un statut', function () {
			cy.contains('Choisir ce statut').click()
			cy.url().should(
				'eq',
				Cypress.config().baseUrl + simulateurBaseUrl + '/resultat/SASU'
			)
		})
	})

	describe('La page résultat', { testIsolation: false }, function () {
		it('devrait s’afficher', function () {
			cy.contains('Choisir votre statut')
			cy.contains('Vous avez choisi le statut :')
		})

		it('devrait respecter le RGAA', function () {
			checkA11Y()
		})
	})
})
