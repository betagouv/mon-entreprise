const fr = Cypress.env('language') === 'fr'

const FIXTURES_FOLDER = 'cypress/fixtures'
const DEMANDE_MOBILITE_FIXTURES_FOLDER = `${FIXTURES_FOLDER}/demande-mobilité`

const writeFixtures = Cypress.env('record_http') !== undefined

describe(`Formulaire demande mobilité (${
	writeFixtures ? 'record mode' : 'stubbed mode'
})`, function () {
	if (!fr) {
		return
	}
	let pendingRequests = new Set()
	let responses = {}
	const hostnamesToRecord = ['geo.api.gouv.fr']

	beforeEach(() => {
		pendingRequests = new Set()
		responses = {}
		cy.setInterceptResponses(
			pendingRequests,
			responses,
			hostnamesToRecord,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
		cy.visit(encodeURI('/gérer/demande-mobilité'))
	})
	afterEach(() => {
		cy.writeInterceptResponses(
			pendingRequests,
			responses,
			DEMANDE_MOBILITE_FIXTURES_FOLDER
		)
	})

	it('should allow to complete and download', () => {
		cy.contains('Salarié').click()

		// "coordonnées" section
		cy.contains('Nom').click({ force: true })
		cy.focused()
			.type('Deaux')
			.tab()
			.type('Jean Bernard')
			.tab()
			.type('1 91 07 468 054 75')
			.tab()
			.type('Française')
			.tab()
			.type('1991-07-25')
		cy.contains('Non').click().wait(250)
		cy.focused().tab().type('Pouts', { force: true }).wait(500).type('{enter}')

		cy.tab().type('{downarrow}').wait(500)
		cy.focused()
			.tab()
			.type('Brest')
			.wait(500)
			.type('{enter}')
			.tab()
			.type('3 rue de la Rhumerie')
			.tab()

		cy.focused()
			.type('614540144500')
			.tab()
			.type('Deaux & Cie')
			.tab()
			.type('14 chemin des Docks')
			.tab()
			.type('Bre')
			.wait(500)
		cy.contains('29240').click()
		cy.focused()
			.tab()
			.type('Deaux')
			.tab()
			.type('Alphonse')
			.tab()
			.type('alphonse.deaux@gamil.com')
			.tab()
			.type('06 85 69 78 54')

		// "activité en France" section
		cy.contains('Pour une période déterminée et dans un seul pays').click()
		cy.contains('Date de début').click({ force: true })
		cy.focused().type('2020-11-06').tab().type('2021-04-09').tab()
		cy.focused().type('Argen{enter}')

		cy.contains('Agent contractuel').click().wait(250)
		cy.focused()
			.tab()
			.tab()
			.type('Haldithet Docks')
			.tab()
			.type('64E45 12-654')
			.tab()
			.type('Handstath street, 9th')
			.tab()
			.type('654004')
			.tab()
			.type('Egrageoiria')

		cy.focused().tab().type('you@ajido.com').tab().type('+94655487015')

		cy.contains("Dans le pays d'accueil").click()
		cy.focused().tab().type('{downarrow}{downarrow}')

		cy.focused().tab().type('{downarrow}')
		cy.focused()
			.tab()

			.type('{downarrow}')
		cy.focused().tab().type('{downarrow}')
		cy.focused().tab().type('{downarrow}')
		cy.focused()
			.tab()

			.type('{downarrow}')
		cy.focused().tab().type('{downarrow}')
		cy.focused().tab()

		cy.focused().type('Docker').tab().type('Docker')

		cy.contains('Divorcé').click().wait(250)
		cy.focused().tab().tab().type('{downarrow}{downarrow}').wait(500)
		cy.focused().tab().type(1)
		cy.contains('Ayant droit n°1')
		cy.focused()
			.tab()
			.type('Deladj')
			.tab()
			.type('Sophie')
			.tab()
			.type('1978-04-21')
			.tab()
		cy.focused().type('{downarrow}').wait(250)
		cy.focused().tab()
		cy.focused().type('{downarrow}').wait(500)

		// download PDF
		cy.contains(
			'Je certifie l’exactitude des informations communiquées ci-dessus'
		).click()
		cy.contains('Fait à').click({ force: true })
		cy.focused().type('Plougastel')
		cy.contains('Générer la demande').click()
		cy.contains('Télécharger le fichier').click()
	})
})
