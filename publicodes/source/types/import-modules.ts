declare module '*.md' {
	const content: string
	export default content
}
declare module '*.ne' {
	const content: any
	export default content
}

// TODO: We could have better types for yaml imports (it works automatically for JSON modules)
declare module '*.yaml' {
	const content: any
	export default content
}
