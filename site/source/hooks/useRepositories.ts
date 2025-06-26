import { useContext } from 'react'

import { RepositoriesContext } from '@/contexts/RepositoriesContext'

export const useRepositories = () => useContext(RepositoriesContext)

export const useEntreprisesRepository = () => useRepositories().entreprises
