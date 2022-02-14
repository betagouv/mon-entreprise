import { CSSProp } from 'styled-components'

declare module 'react' {
	interface DOMAttributes<T> {
		// @ts-ignore
		css?: CSSProp
	}
}

declare global {
	namespace JSX {
		interface IntrinsicAttributes {
			// @ts-ignore
			css?: CSSProp
		}
	}
}
