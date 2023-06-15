import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState,
} from 'react'

type CasParticuliersType = {
	isAutoEntrepreneurACREEnabled: boolean
	setIsAutoEntrepreneurACREEnabled: Dispatch<SetStateAction<boolean>>
}

const CasParticuliersContext = createContext<CasParticuliersType>({
	isAutoEntrepreneurACREEnabled: false,
	setIsAutoEntrepreneurACREEnabled: () => null,
})

export const CasParticuliersProvider = ({
	children,
}: {
	children: ReactNode
}) => {
	const [isAutoEntrepreneurACREEnabled, setIsAutoEntrepreneurACREEnabled] =
		useState(false)

	return (
		<CasParticuliersContext.Provider
			value={{
				isAutoEntrepreneurACREEnabled,
				setIsAutoEntrepreneurACREEnabled,
			}}
		>
			{children}
		</CasParticuliersContext.Provider>
	)
}

export const useCasParticuliers = () => useContext(CasParticuliersContext)
