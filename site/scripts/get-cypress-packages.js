import { readFileSync } from 'fs'

const packages = JSON.parse(
	readFileSync(new URL('../package.json', import.meta.url).pathname)
)

console.log('cypress@' + packages.devDependencies.cypress)
for (const key of Object.keys(packages.devDependencies).filter(
	(k) => k !== 'cypress' && k.startsWith('cypress')
)) {
	console.log(key + '@' + packages.devDependencies[key])
}
