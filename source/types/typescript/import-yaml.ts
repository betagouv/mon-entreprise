// TODO: We could have better types for yaml imports (it works automatically for JSON modules)

declare module '*.yaml' {
	const content: any
	export default content
}
