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
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

import { createDataDir, writeInDataDir, dataDir } from './utils.js'

dotenv.config()

// Directory for storing release images
const imagesDir = join(dataDir, 'releases-images')

// We use the GitHub API V4 in GraphQL to download the releases. A GraphQL
// explorer can be found here : https://developer.github.com/v4/explorer/
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

/**
 * Create releases-images directory and process images in release descriptions
 */
function createImagesDir() {
	if (!existsSync(imagesDir)) {
		mkdirSync(imagesDir, { recursive: true })
	}
}

/**
 * Extract image URLs from markdown and download them
 * Replaces GitHub image URLs with local paths in the description
 */
async function downloadAndReplaceImages(releaseDescription, releaseName) {
	if (!releaseDescription) return releaseDescription

	// Regex to match markdown images: ![alt](url)
	const imageRegex = /!\[(.*?)\]\((https:\/\/github\.com\/.*?\/assets\/\d+\/[a-f0-9-]+\.\w+)\)/g

	let modifiedDescription = releaseDescription
	let match

	while ((match = imageRegex.exec(releaseDescription)) !== null) {
		const [fullMatch, altText, imageUrl] = match
		const filename = imageUrl.split('/').pop()
		const localImagePath = `/data/releases-images/${filename}`

		// Download image from GitHub
		try {
			const response = await fetch(imageUrl)
			if (!response.ok) throw new Error(`HTTP ${response.status}`)

			const buffer = await response.arrayBuffer()
			const filepath = join(imagesDir, filename)
			writeFileSync(filepath, Buffer.from(buffer))

			// Replace the URL with local path in markdown
			// Keep the alt text for accessibility
			modifiedDescription = modifiedDescription.replace(
				fullMatch,
				`![${altText}](${localImagePath})`
			)

			console.log(`✓ Downloaded image: ${filename}`)
		} catch (error) {
			console.warn(`✗ Failed to download image ${imageUrl}: ${error.message}`)
			// Keep original URL if download fails
		}
	}

	return modifiedDescription
}

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

		// Process and download images from release descriptions
		createImagesDir()
		const processedReleases = await Promise.all(
			[...releases.filter(({ isDraft }) => !isDraft), ...concat].map(
				async (release) => ({
					...release,
					description: await downloadAndReplaceImages(
						release.description,
						release.name
					),
				})
			)
		)

		return processedReleases
	} catch (e) {
		console.error('Error fetching releases:', e)
		return fakeData
	}
}
