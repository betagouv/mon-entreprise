import { useEffect, useState } from 'react'

import { Entreprise } from '@/domaine/Entreprise'
import { useEntreprisesRepository } from '@/hooks/useRepositories'

import { useDebounce } from './useDebounce'

export default function useSearchCompany(
	value: string
): [boolean, Array<Entreprise>] {
	const [result, setResult] = useState<Array<Entreprise>>([])
	const [searchPending, setSearchPending] = useState(Boolean(value))
	const debouncedValue = useDebounce(value, 300)
	const entreprisesRepository = useEntreprisesRepository()

	useEffect(() => {
		setSearchPending(Boolean(value))
		if (!value) {
			setResult([])
		}
	}, [value, setResult, setSearchPending])

	useEffect(() => {
		if (!debouncedValue) {
			return
		}

		entreprisesRepository
			.rechercheTexteLibre(debouncedValue)
			.then((entreprise: Array<Entreprise> | null) => {
				setResult(entreprise || [])
				setSearchPending(false)
			})
			.catch((err) => {
				setSearchPending(false)

				// eslint-disable-next-line no-console
				console.error(err)
			})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending || value !== debouncedValue, result.slice(0, 6)]
}
