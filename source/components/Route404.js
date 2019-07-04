import { React, T } from 'Components'
import image from 'Images/map-directions.png'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'

export default () => (
	<div
		style={{
			color: '#333350',
			margin: '15% auto',
			width: '15em',
			textAlign: 'center'
		}}>
		<p>
			<T k="404.message">Cette page n'existe pas ou n'existe plus</T>
			{emoji(' 🙅')}
		</p>
		<Link to="/">
			{/* TODO: credits for the image to add: https://thenounproject.com/term/treasure-map/96666/ */}
			<img style={{ margin: '3%' }} width="100%" src={image} />
			<em>
				<T k="404.action">Revenir en lieu sûr</T>
			</em>
		</Link>
	</div>
)
