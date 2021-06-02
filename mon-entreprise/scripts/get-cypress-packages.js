const fs = require('fs')

const packages = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`))

console.log('cypress@' + packages.devDependencies.cypress)
for (const key of Object.keys(packages.devDependencies).filter(
	(k) => k !== 'cypress' && k.startsWith('cypress')
)) {
	console.log(key + '@' + packages.devDependencies[key])
}
