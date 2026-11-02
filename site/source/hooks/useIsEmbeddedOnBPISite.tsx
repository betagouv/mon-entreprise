import { createContext, PropsWithChildren, useContext, useState } from 'react'

import { useNavigation } from '@/lib/navigation'
import { environnement } from '@/services/environnement/environnement'

const BPIContext = createContext(false)

export const IsBPIProvider = ({ children }: PropsWithChildren) => {
	const [isBPI, setIsBPI] = useState(false)
	const { searchParams } = useNavigation()
	const BPIInSearchParams = searchParams
		.toString()
		.includes('bpifrance-creation')
	const BPIInReferer =
		!environnement.isServerSide &&
		document.referrer?.includes('bpifrance-creation')
	if (!isBPI && (BPIInSearchParams || BPIInReferer)) {
		setIsBPI(true)
	}

	return <BPIContext.Provider value={isBPI}>{children}</BPIContext.Provider>
}

export function useIsEmbeddedOnBPISite() {
	return useContext(BPIContext)
}
