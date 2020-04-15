// This script uses the GitHub API which requires an access token.
// https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
// Once you have your access token you can put it in a `.env` file at the root
// of the project to enable it during development. For instance:
//
// GITHUB_API_SECRET=f4336c82cb1e494752d06e610614eab12b65f1d1
//
// If you want to fetch unpublished "draft" release, you should check the
// "public repo" authorization when generating the access token.
require('dotenv').config()
require('isomorphic-fetch')
// const fs = require('fs')
// const path = require('path')
var { createDataDir, writeInDataDir } = require('./utils.js')

// We use the GitHub API V4 in GraphQL to download the releases. A GraphQL
// explorer can be found here : https://developer.github.com/v4/explorer/
const githubAuthToken = process.env.GITHUB_API_SECRET
const cursorOfV1Release = 'Y3Vyc29yOnYyOpHOARHb8g=='
const query = `query {
	repository(owner:"betagouv", name:"mon-entreprise") {
		releases(after:"${cursorOfV1Release}", last:100) {
			nodes {
				name
				description
			}
		}
	}
}`

// In case we cannot fetch the release (the API is down or the Authorization
// token isn't valid) we fallback to some fake data -- it would be better to
// have a static ressource accessible without authentification.
const fakeData = [
	{
		name: 'Fake release',
		descriptionHTML: `You are seing this fake release because you 
	didn't configure your GitHub access token and we weren't
	able to fetch the real releases from GitHub.<br /><br />
	See the script <pre>fetch-releases.js</pre> for more informations.`
	},
	{
		name: 'Release 2',
		descriptionHTML: 'blah blah blah'
	},
	{
		name: 'Release 3',
		descriptionHTML: 'blah blah blah'
	}
]

// const dataDir = path.resolve(__dirname, '../data/')

async function main() {
	createDataDir()
	const releases = await fetchReleases()
	writeInDataDir('releases.json', releases)
	writeInDataDir('last-release.json', { lastRelease: releases[0].name })
	// writeReleasesInDataDir(await fetchReleases())
}

// function createDataDir() {
// 	if (!fs.existsSync(dataDir)) {
// 		fs.mkdirSync(dataDir)
// 	}
// }

async function fetchReleases() {
	if (!githubAuthToken) {
		return fakeData
	}
	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'post',
			headers: new Headers({ Authorization: `bearer ${githubAuthToken}` }),
			body: JSON.stringify({ query })
		})
		const {
			data: {
				repository: {
					releases: { nodes: releases }
				}
			}
		} = await response.json()
		return releases.filter(Boolean).reverse()
	} catch (e) {
		return fakeData
	}
}

// function writeReleasesInDataDir(releases) {
// 	// The last release name is fetched on all pages (to display the banner)
// 	// whereas the full release data is used only in the dedicated page, that why
// 	// we deduplicate the releases data in two separated files that can be
// 	// bundled/fetched separately.
// 	fs.writeFileSync(
// 		path.join(dataDir, 'releases.json'),
// 		JSON.stringify(releases)
// 	)
// 	fs.writeFileSync(
// 		path.join(dataDir, 'last-release.json'),
// 		JSON.stringify({ lastRelease: releases[0].name })
// 	)
// }

main()
