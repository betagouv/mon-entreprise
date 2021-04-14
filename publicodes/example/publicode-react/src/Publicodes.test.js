import { fireEvent, render, screen } from '@testing-library/react'
import fs from 'fs'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import ruleURL from './CO2-douche.publicodes.yaml'
import Publicodes from './Publicodes'

const server = setupServer(
	rest.get(ruleURL, (_, res, ctx) => {
		// Respond with a mocked user token that gets persisted
		// in the `sessionStorage` by the `Login` component.
		const rules = fs.readFileSync('./src/CO2-douche.publicodes.yaml', 'utf8')
		return res(ctx.text(rules))
	})
)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests ar
test('renders loading text while fetching rules', () => {
	render(<Publicodes />)
	const loadElement = screen.getByText(
		/Chargement des règles de calculs en cours.../i
	)
	expect(loadElement).toBeInTheDocument()
})

test('initialize correctly publicodes', async () => {
	render(<Publicodes />)
	const title = await screen.findByText('Toutes les règles')
	expect(title).toBeInTheDocument()
})

test('correctly render result in documentation', async () => {
	render(<Publicodes />)
	const douche = await screen.findByText('douche')
	fireEvent.click(douche)
	const result = await screen.findByText('134,65 kgCO2eq / an')
	expect(result).toBeInTheDocument()
})
