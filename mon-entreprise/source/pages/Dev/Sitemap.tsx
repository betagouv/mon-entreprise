import { SitePathsContext } from 'Components/utils/SitePathsContext'
import { H1 } from 'DesignSystem/typography/heading'
import { useContext } from 'react'
import { generateSiteMap } from '../../sitePaths'

export default function SiteMap() {
	const sitePaths = useContext(SitePathsContext)
	return (
		<>
			<H1>Sitemap</H1>
			<pre>
				{generateSiteMap(sitePaths).map((path) => (
					<span key={path}>
						{path}
						<br />
					</span>
				))}
			</pre>
		</>
	)
}
