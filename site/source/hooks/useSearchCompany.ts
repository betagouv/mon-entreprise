import {
	FabriqueSocialEntreprise,
	searchDenominationOrSiren,
} from 'API/fabrique-social'
import { useEffect, useState } from 'react'
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

		searchDenominationOrSiren(debouncedValue).then(
			(entreprise: Array<FabriqueSocialEntreprise> | null) => {
				setResult(entreprise || [])
				setSearchPending(false)
			}
		)
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending && result.length <= 0, result.slice(0, 6)]
}
