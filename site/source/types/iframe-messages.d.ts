export type IframeMessage =
	| {
			kind: 'get-offset'
	  }
	| {
			kind: 'resize-height' | 'offset'
			value: number
	  }

export interface IframeHandlers {
	cleanup: () => void
}
