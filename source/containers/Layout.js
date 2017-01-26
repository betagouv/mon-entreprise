import React, { Component } from 'react'
import './Layout.css'
import './reset.css'
import {Link} from 'react-router'

export default class Layout extends Component {
	render() {
		return (<div>
			<div id="header">
				<div id="warning">
					Attention ! Tout le contenu de ce site est hautement expérimental.
				</div>
				{
					this.props.location.pathname != '/' &&
					<Link to="/">
						<img id="site-logo" src={require('../images/logo.png')} style={{width: '100px'}} />
					</Link>
				}
			</div>
			<div id="content">
				{this.props.children}
			</div>

			</div>
		)
	}
}
