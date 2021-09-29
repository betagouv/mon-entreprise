import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'

const InitialRenderContext = createContext(true)

export function WatchInitialRender(props: { children: ReactNode }) {
	const [initialRender, setInitialRender] = useState(true)
	useEffect(() => {
		setInitialRender(false)
	}, [])
	return (
		<InitialRenderContext.Provider value={initialRender}>
			{props.children}
		</InitialRenderContext.Provider>
	)
}

export function useInitialRender() {
	const initialRender = useContext(InitialRenderContext)
	const unChangedInitialRender = useMemo(() => initialRender, [])
	return unChangedInitialRender
}
