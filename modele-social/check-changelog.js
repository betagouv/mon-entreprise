// Ensure that current package version is referenced in the Changelog.md
import { readFileSync } from 'fs'

const packageVersion = JSON.parse(
	readFileSync(new URL('./package.json', import.meta.url).pathname)
).version

const changelog = readFileSync(
	new URL('./CHANGELOG.md', import.meta.url).pathname
)

if (!changelog.includes(`## ${packageVersion}\n`)) {
	throw Error(
		`Current version ${packageVersion} is not referenced in the CHANGELOG.md`
	)
}
