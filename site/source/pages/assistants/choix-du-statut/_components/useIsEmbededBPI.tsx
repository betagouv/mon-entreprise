import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'

const BPIContext = createContext(false)

export const IsBPIProvider = ({ children }: PropsWithChildren) => {
	const [isBPI, setIsBPI] = useState(false)
	const BPIInSearchParams = useLocation().search.includes('bpifrance-creation')
	const BPIInReferer =
		!import.meta.env.SSR && document.referrer?.includes('bpifrance-creation')
	if (!isBPI && (BPIInSearchParams || BPIInReferer)) {
		setIsBPI(true)
	}

	return <BPIContext.Provider value={isBPI}>{children}</BPIContext.Provider>
}

export default function useIsEmbededOnBPISite() {
	return useContext(BPIContext)
}
