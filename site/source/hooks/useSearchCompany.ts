import { useEffect, useState } from 'react'

import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from '@/api/fabrique-social'

import { useDebounce } from './useDebounce'

export default function useSearchCompany(
	value: string
): [boolean, Array<FabriqueSocialEntreprise>] {
	const [result, setResult] = useState<Array<FabriqueSocialEntreprise>>([])
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
			.then((entreprise: Array<FabriqueSocialEntreprise> | null) => {
				setResult(entreprise || [])
				setSearchPending(false)
			})
			.catch((err) => {
				setSearchPending(false)

				// eslint-disable-next-line no-console
				console.error(err)
			})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending && result.length <= 0, result.slice(0, 6)]
}
