interface Window {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	parentIFrame?: any
}

// Types from @types/iframe-resizer are for V3 and we use V4
declare module 'iframe-resizer' {
	export const iframeResize: (options: unknown, id: string) => void
}
