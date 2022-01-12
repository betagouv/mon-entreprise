import { createContext, useState } from 'react'

type NavTitleType = {
	titles: HTMLHeadingElement[]
	addTitles(titles :  HTMLHeadingElement[]): void
}

export const NavTitleContext = createContext<NavTitleType>(
	{} as NavTitleType
)

export const NavTitleProvider = function({children}: {children: React.ReactNode}) {
	const [titles, setTitles] = useState<HTMLHeadingElement[]>([])
	const addTitles = (newTitles: HTMLHeadingElement[]) => {
		setTitles([...titles, ...newTitles])
	}
	const store: NavTitleType =  { titles, addTitles }
	return (
		<NavTitleContext.Provider value={store}>
			{children}
		</NavTitleContext.Provider>
	)
}
