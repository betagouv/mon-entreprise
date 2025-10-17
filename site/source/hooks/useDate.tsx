import { useEngine } from './useEngine'

export default function useDate() {
	const date = useEngine().evaluate('date')

	return date.nodeValue
}
