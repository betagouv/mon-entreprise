import { CSSProp, DefaultTheme } from 'styled-components'

declare module 'react' {
	interface DOMAttributes<T> {
		// @ts-ignore
		css?: CSSProp<DefaultTheme>
	}
}

declare global {
	namespace JSX {
		interface IntrinsicAttributes {
			// @ts-ignore
			css?: CSSProp<DefaultTheme>
		}
	}
}
