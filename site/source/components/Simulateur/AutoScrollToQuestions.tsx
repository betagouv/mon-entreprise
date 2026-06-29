import { createContext, useContext, useState } from 'react'

type AutoScrollToQuestionsContextType = {
	autoScrollToQuestions: boolean
	setAutoScrollToQuestions: (autoScroll: boolean) => void
}

export const AutoScrollToQuestionsContext =
	createContext<AutoScrollToQuestionsContextType>({
		autoScrollToQuestions: false,
		setAutoScrollToQuestions: () => {},
	})

export function AutoScrollToQuestionsProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [autoScrollToQuestions, setAutoScrollToQuestions] =
		useState<boolean>(true)

	return (
		<AutoScrollToQuestionsContext.Provider
			value={{ autoScrollToQuestions, setAutoScrollToQuestions }}
		>
			{children}
		</AutoScrollToQuestionsContext.Provider>
	)
}

export function useAutoScrollToQuestions(): AutoScrollToQuestionsContextType {
	const context = useContext(AutoScrollToQuestionsContext)

	if (!context) {
		throw new Error(
			'useAutoScrollToQuestions doit être utilisé dans un AutoScrollToQuestionsProvider'
		)
	}

	return context
}
