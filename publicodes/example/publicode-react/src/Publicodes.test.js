import { render, screen } from '@testing-library/react'
import Publicodes from './Publicodes'

test('renders loading text while fetching rules', () => {
	render(<Publicodes />)
	const loadElement = screen.getByText(
		/Chargement des règles de calculs en cours.../i
	)
	expect(loadElement).toBeInTheDocument()
})
