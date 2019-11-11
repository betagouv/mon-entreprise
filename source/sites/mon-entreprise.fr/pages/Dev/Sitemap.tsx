import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { generateSiteMap, SitePathsType } from '../../sitePaths'

export default function SiteMap() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<h1>Sitemap</h1>
			<pre>
				{generateSiteMap(sitePaths as SitePathsType).map(path => (
					<span key={path}>
						{path}
						<br />
					</span>
				))}
			</pre>
		</>
	)
}
