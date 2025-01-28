// Ensure that current package version is referenced in the Changelog.md
import { readFileSync } from 'fs'

const packageVersion = JSON.parse(readFileSync('./package.json')).version

const changelog = readFileSync('./CHANGELOG.md')

if (!changelog.includes(`## ${packageVersion}\n`)) {
	throw Error(
		`Current version ${packageVersion} is not referenced in the CHANGELOG.md`
	)
}
