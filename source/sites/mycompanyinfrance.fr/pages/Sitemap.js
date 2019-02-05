import withSitePaths from 'Components/utils/withSitePaths'
import React from 'react'
import { generateSiteMap } from '../sitePaths'

const SiteMap = ({ sitePaths }) => (
	<>
		<h1>Sitemap</h1>
		<pre>
			{generateSiteMap(
				sitePaths.map(path => (
					<span key={path}>
						{path}
						<br />
					</span>
				))
			)}
		</pre>
	</>
)

export default withSitePaths(SiteMap)
