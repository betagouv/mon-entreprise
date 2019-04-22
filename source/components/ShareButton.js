import React from 'react'
import icon from 'Images/share.svg'

export default props =>
	navigator.share ? (
		<button
			css="margin: 0 auto; display: block"
			onClick={() =>
				navigator
					.share(props)
					.then(() => console.log('Successful share'))
					.catch(error => console.log('Error sharing', error))
			}>
			<img css="width: 3em" src={icon} title="Partager" />
			{/* Created by Barracuda from the Noun Project */}
		</button>
	) : null
