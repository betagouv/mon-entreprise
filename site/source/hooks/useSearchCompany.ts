import { Etablissement, searchDenominationOrSiren } from 'api/sirene'
import { useEffect, useState } from 'react'
import { useDebounce } from './useDebounce'

export default function useSearchCompany(
	value: string
): [boolean, Array<Etablissement>] {
	const [result, setResult] = useState<Array<Etablissement>>([])
	const [searchPending, setSearchPending] = useState(!!value)
	const debouncedValue = useDebounce(value, 300)

	useEffect(() => {
		setSearchPending(!!value)

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
