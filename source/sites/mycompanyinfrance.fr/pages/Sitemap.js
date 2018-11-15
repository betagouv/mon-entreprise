import React from 'react'
import sitePaths, { generateSiteMap } from '../sitePaths'
const SiteMap = () => (
	<>
		<h1>Sitemap</h1>
		<pre>
			{generateSiteMap(sitePaths()).map(path => (
				<span key={path}>
					{path}
					<br />
				</span>
			))}
		</pre>
	</>
)

export default SiteMap
