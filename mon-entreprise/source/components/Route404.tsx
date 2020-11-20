import image from 'Images/map-directions.png'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'

export default () => (
	<div
		style={{
			color: '#333350',
			margin: '15% auto',
			width: '15em',
			textAlign: 'center'
		}}
	>
		<p>
			<Trans i18nKey="404.message">
				Cette page n'existe pas ou n'existe plus
			</Trans>
			{emoji(' 🙅')}
		</p>
		<Link to="/">
			{/* TODO: credits for the image to add: https://thenounproject.com/term/treasure-map/96666/ */}
			<img style={{ margin: '3%' }} width="100%" src={image} />
			<em>
				<Trans i18nKey="404.action">Revenir en lieu sûr</Trans>
			</em>
		</Link>
	</div>
)
