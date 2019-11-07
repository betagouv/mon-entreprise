import { Link } from 'react-router-dom'
import { React } from 'Components'
import withSitePaths from 'Components/utils/withSitePaths'

const _DocumentationButton = ({ sitePaths, ...props }) => (
	<div
		css={`
			display: flex;
			align-items: center;
			justify-content: center;
		`}>
		<Link {...props} to={sitePaths.documentation.index}>
			Voir toute la documentation
		</Link>
	</div>
)

export const DocumentationButton = withSitePaths(_DocumentationButton)
