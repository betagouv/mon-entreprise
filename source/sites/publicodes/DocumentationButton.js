import { SitePathsContext } from 'Components/utils/withSitePaths'
import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
	const sitePaths = useContext(SitePathsContext)

	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: center;
			`}
		>
			<Link {...props} to={sitePaths.documentation.index}>
				Voir toute la documentation
			</Link>
		</div>
	)
}
