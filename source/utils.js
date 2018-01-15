export let capitalise0 = name => name[0].toUpperCase() + name.slice(1)
export let getJsScriptAttribute = attribute => () => {
	let script =
		document.currentScript || [...document.getElementsByTagName('script')].pop()
	return script && script.getAttribute(attribute)
}
