import { CSSProp, DefaultTheme } from 'styled-components'

declare module 'react' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
