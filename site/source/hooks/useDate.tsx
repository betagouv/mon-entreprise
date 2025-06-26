import { useEngine } from '../components/utils/EngineContext'

export default function useDate() {
	const date = useEngine().evaluate('date')

	return date.nodeValue
}
