import { Entreprise, searchDenominationOrSiren } from 'API/fabrique-social'
import { useEffect, useState } from 'react'
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

		searchDenominationOrSiren(debouncedValue).then((établissements) => {
			setResult(établissements || [])
			setSearchPending(false)
		})
	}, [debouncedValue, setResult, setSearchPending])

	return [searchPending && result.length <= 0, result.slice(0, 6)]
}
