import { createContext, PropsWithChildren, useContext, useState } from 'react'

import { useNavigation } from '@/lib/navigation'

const BPIContext = createContext(false)

export const IsBPIProvider = ({ children }: PropsWithChildren) => {
	const [isBPI, setIsBPI] = useState(false)
	const { searchParams } = useNavigation()
	const BPIInSearchParams = searchParams
		.toString()
		.includes('bpifrance-creation')
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
