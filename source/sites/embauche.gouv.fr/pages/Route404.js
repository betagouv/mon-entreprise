import React from 'react'
import { Link } from 'react-router-dom'
import image from '../images/map-directions.png'

const Page404 = () => (
	<div
		style={{
			color: '#333350',
			margin: '15% auto',
			width: '15em',
			textAlign: 'center'
		}}>
		<h2>On peut facilement se perdre dans la législation...</h2>
		<Link to="/">
			{/* TODO: credits for the image to add: https://thenounproject.com/term/treasure-map/96666/ */}
			<img style={{ margin: '3%' }} width="100%" src={image} />
			<em>Revenir en lieu sûr</em>
		</Link>
	</div>
)

export default Page404
