import React, { Component } from 'react'
import './Pages.css'
import Header from './Header'

// TODO reprendre les icônes de embauche.gouv.fr version novembre 2017
// pour expliquer la contribution au projet

// parler du fait qu'on ne contribue pas simplement à une calculette

export default class Contribution extends Component {
	render() {
		return (
			<section className="page" id="contribution">
				<Header />
				<h1>Contribuer</h1>
				<p>
					Tout le développement se fait de façon transparente et contributive
					sur{' '}
					<a href="https://github.com/sgmap/syso" target="_blank">
						GitHub
					</a>.
				</p>
			</section>
		)
	}
}
