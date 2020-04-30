import { SitePathsContext } from 'Components/utils/SitePathsContext'
import React, { useContext } from 'react'
import { generateSiteMap, SitePathsType } from '../../sitePaths'

export default function SiteMap() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<h1>Sitemap</h1>
			<pre>
				{generateSiteMap(sitePaths).map(path => (
					<span key={path}>
						{path}
						<br />
					</span>
				))}
			</pre>
		</>
	)
}
