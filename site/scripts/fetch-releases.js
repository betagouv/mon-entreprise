// This script uses the GitHub API which requires an access token.
// https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line
// Once you have your access token you can put it in a `.env` file at the root
// of the project to enable it during development. For instance:
//
// GITHUB_API_SECRET=f4336c82cb1e494752d06e610614eab12b65f1d1
//
// If you want to fetch unpublished "draft" release, you should check the
// "public repo" authorization when generating the access token.
import dotenv from 'dotenv'

import { createDataDir, writeInDataDir } from './utils.js'

dotenv.config()

// We use the GitHub API V4 in GraphQL to download the releases. A GraphQL
// To learn how to use a GraphQL client see Github documentation :
// https://docs.github.com/en/graphql/guides/using-graphql-clients
const githubAuthToken = process.env.GITHUB_API_SECRET
const queryLastRelease = (after) => `query {
	repository(owner:"betagouv", name:"mon-entreprise") {
		releases(after: ${after}, first: 25, orderBy: { field: CREATED_AT, direction: DESC }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        createdAt
        name
        tagName
				description
				isDraft
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
		description: `You are seing this fake release because you
	didn't configure your GitHub access token and we weren't
	able to fetch the real releases from GitHub.<br /><br />
	See the script <pre>fetch-releases.js</pre> for more informations.`,
	},
	{
		name: 'Release 2',
		description: 'blah blah blah',
	},
	{
		name: 'Release 3',
		description: 'blah blah blah',
	},
]

createDataDir()
const releases = await fetchReleases()
// The last release name is fetched on all pages (to display the banner)
// whereas the full release data is used only in the dedicated page, that why
// we deduplicate the releases data in two separated files that can be
// bundled/fetched separately.
writeInDataDir('releases.json', releases)
writeInDataDir('last-release.json', { name: releases[0].name })

async function fetchReleases(after = 'null') {
	if (!githubAuthToken) {
		return fakeData
	}
	try {
		const response = await fetch('https://api.github.com/graphql', {
			method: 'post',
			headers: new Headers({ Authorization: `bearer ${githubAuthToken}` }),
			body: JSON.stringify({ query: queryLastRelease(after) }),
		})
		const {
			data: {
				repository: {
					releases: { nodes: releases, pageInfo },
				},
			},
		} = await response.json()
		let concat = []
		const indexOfV1InReleases = releases.findIndex(
			({ tagName }) => tagName === 'v1.0.0'
		)
		if (indexOfV1InReleases >= 0) {
			// remove releases before v1.0.0 tagName
			releases.splice(indexOfV1InReleases + 1, releases.length - 1)
		}
		if (pageInfo.hasNextPage && indexOfV1InReleases === -1) {
			concat = await fetchReleases(`"${pageInfo.endCursor}"`)
		}

		return [...releases.filter(({ isDraft }) => !isDraft), ...concat]
	} catch (e) {
		return fakeData
	}
}
