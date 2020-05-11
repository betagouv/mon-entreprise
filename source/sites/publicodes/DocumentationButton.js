import { SitePathsContext } from 'Components/utils/withSitePaths'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import emoji from 'react-easy-emoji'

const DocumentationButton = (props) => {
	const sitePaths = useContext(SitePathsContext)

	return (
		<div
			css={`
				display: flex;
				align-items: center;
				justify-content: center;
				img {
					margin-right: 0.4rem !important;
				}
			`}
		>
			{emoji('📄')}
			<Link {...props} to={sitePaths.documentation.index}>
				Voir toute la documentation
			</Link>
		</div>
	)
}

export default DocumentationButton
