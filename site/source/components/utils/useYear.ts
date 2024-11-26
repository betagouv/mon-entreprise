import { useEngine } from './EngineContext'

export default function useYear() {
	const year = useEngine().evaluate('date')

	return Number(
		year.nodeValue?.toString().slice(-4) || new Date().getFullYear()
	)
}
