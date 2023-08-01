// TODO: We could have better types for yaml imports (it works automatically for JSON modules)

declare module '*.yaml' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const content: any
	export default content
}
