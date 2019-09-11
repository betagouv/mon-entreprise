import { Markdown } from 'Components/utils/markdown'
import { path } from 'ramda'
import React, { useState } from 'react'
import './Dictionary.css'
import Overlay from './Overlay'

// On ajoute à la section la possibilité d'ouvrir un panneau d'explication des termes.
// Il suffit à la section d'appeler une fonction fournie en lui donnant du JSX
export let AttachDictionary = dictionary => Decorated =>
	function withDictionary(props) {
		const [{ explanation, term }, setState] = useState({
			term: null,
			explanation: null
		})

		const onClick = e => {
			let term = e.target.dataset['termDefinition'],
				explanation = path([term, 'description'], dictionary)
			if (!term) return null
			setState({ explanation, term })
		}

		return (
			<div onClick={onClick}>
				<Decorated {...props} />
				{explanation && (
					<Overlay onClose={() => setState({ term: null, explanation: null })}>
						<div id="dictionaryPanel">
							<Markdown source={`### Mécanisme : ${term}\n\n${explanation}`} />
						</div>
					</Overlay>
				)}
			</div>
		)
	}
