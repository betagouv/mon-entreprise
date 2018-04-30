import React from 'react'
import './Pages.css'
import Simu from '../Simu'
import News from '../News'

export default () => (
	<div id="home" className="page">
		{/*	Use this News component to talk about things that are not naturally discoverable */}
		{/*	<News /> */}
		<Simu />
	</div>
)
