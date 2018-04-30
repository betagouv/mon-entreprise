import React from 'react'
import './Pages.css'
import './Home.css'
import Simu from '../Simu'
import News from '../News'

export default () => (
	<div id="home" className="page">
		{/*	Use this News component to talk about things that are not naturally discoverable */}
		{/*	<News /> */}
		<Simu />
		<a href="https://beta.gouv.fr" target="_blank">
			<img
				id="marianne"
				src={require('Images/marianne.svg')}
				alt="Un service de l'État français"
			/>
		</a>
	</div>
)
