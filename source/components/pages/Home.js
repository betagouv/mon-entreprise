import React from 'react'
import './Pages.css'
import Simu from '../Simu'
import News from '../News'

export default () => (
	<div id="home" className="page">
		<News />
		<Simu />
	</div>
)
