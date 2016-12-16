import React, { Component } from 'react'
import './Layout.css'
import {Link} from 'react-router'

export default class Layout extends Component {
	render() {
		return (<div>
			<div id="header">
				{
					this.props.location.pathname != '/' &&
					<Link to="/">
						<img id="site-logo" src={require('../images/logo.png')} style={{width: '100px'}} />
					</Link>
				}
			</div>
			{this.props.children}
			<div id="warning">
				Attention ! Tout le contenu de ce site est hautement expérimental.
			</div>
			</div>
		)
	}
}
