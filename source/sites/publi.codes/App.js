import React, { useState, useEffect } from 'react'

let Landing = () => {
	useEffect(() => {
		var css = document.createElement('style')
		css.type = 'text/css'
		css.innerHTML = `
		#js {
			animation: appear 0.5s;
			opacity: 1;
		}
		#loading {
			display: none !important;
		}`
		document.body.appendChild(css)
	})
	return (
		<div>
			<div css="text-align: center">
				<h1 css="">
					<span css="border: 3px solid black; padding: 0.1rem 0.4rem 0.1rem 0.6rem ; width: 5rem">
						publi
					</span>
					<span css="background: black; color: white; padding: 0.1rem 0.6rem 0.1rem 0.4rem; width: 5rem; border: 3px solid black">
						codes
					</span>
				</h1>
				<p css="width: 28rem; margin: 0 auto">
					Un lagage de calcul ouvert, lisible en français, contributif, pour
					encoder les sujets de société.
				</p>
			</div>
			<h2>
				La sécurité sociale et les impôts -{' '}
				<a href="https://mon-entreprise.fr">mon-entreprise.fr</a>
			</h2>

			<h2>
				L'impact climatique de nos gestes du quotidien - futur.eco-{' '}
				<a href="https://mon-entreprise.fr">mon-entreprise.fr</a>
			</h2>
		</div>
	)
}

let ExportedApp = Landing

// Remove loader

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Landing)
}

export default ExportedApp
