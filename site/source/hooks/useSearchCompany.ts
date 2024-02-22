import { useEffect, useState } from 'react'

import { searchDenominationOrSiren } from '@/api/fabrique-social'
import { Entreprise } from '@/domain/Entreprise'

import { useDebounce } from './useDebounce'

export default function useSearchCompany(
	value: string
): [boolean, Array<Entreprise>] {
	const [result, setResult] = useState<Array<Entreprise>>([])
	const [searchPending, setSearchPending] = useState(Boolean(value))
	const debouncedValue = useDebounce(value, 300)

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

		searchDenominationOrSiren(debouncedValue)
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
