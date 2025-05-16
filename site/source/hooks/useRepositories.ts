import { useContext } from 'react'

import { RepositoriesContext } from '@/entreprise/RepositoriesContext'

export const useRepositories = () => useContext(RepositoriesContext)

export const useEntreprisesRepository = () => useRepositories().entreprises
