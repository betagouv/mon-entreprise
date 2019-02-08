import { toPairs } from 'ramda'
import React from 'react'
import { withTranslation } from 'react-i18next'
import references from 'Règles/ressources/références/références.yaml'
import { capitalise0 } from '../../utils'
import './References.css'

export default withTranslation()(
	class References extends React.Component {
		state = {
			showComplementary: false
		}
		render() {
			let { refs } = this.props,
				references = toPairs(refs)
			return <ul className="references">{references.map(this.renderRef)}</ul>
		}
		renderRef = ([name, link]) => {
			let refKey = this.findRefKey(link),
				refData = (refKey && references[refKey]) || {},
				domain = this.cleanDomain(link)

			return (
				<li key={name}>
					<span className="imageWrapper">
						{refData.image && (
							<img
								src={require('Règles/ressources/références/' + refData.image)}
							/>
						)}
					</span>
					<a href={link} target="_blank">
						{capitalise0(name)}
					</a>
					<span className="url">{domain}</span>
				</li>
			)
		}
		findRefKey(link) {
			return Object.keys(references).find(r => link.indexOf(r) > -1)
		}
		cleanDomain(link) {
			return (link.indexOf('://') > -1
				? link.split('/')[2]
				: link.split('/')[0]
			).replace('www.', '')
		}
	}
)
