import { createContext } from 'react'

import { FabriqueSocialEntreprisesRepository } from '@/api/RechercheEntreprise/fabrique-social'
import { EntreprisesRepository } from '@/domain/EntreprisesRepository'

interface Repositories {
	entreprises: EntreprisesRepository
}

export const RepositoriesContext = createContext<Repositories>({
	entreprises: FabriqueSocialEntreprisesRepository,
})
