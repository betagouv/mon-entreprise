import React from 'react'
import R from 'ramda'
import './References.css'
import references from 'Règles/ressources/références/références.yaml'
import { capitalise0 } from '../../utils'

export default class References extends React.Component {
	state = {
		showComplementary: false
	}
	render() {
		let { refs } = this.props,
			{ complementary, official = [] } = R.groupBy(
				([name, link]) => (this.findRefKey(link) ? 'official' : 'complementary')
			)(R.toPairs(refs)),
			showComplementary = this.state.showComplementary,
			showComplementaryButton = !this.state.showComplementary && complementary

		return (
			<ul className="references">
				{[
					...official.map(this.renderRef),
					official.length == 0 ? (
						<li id="noOfficialReferences">Pas de sources officielles</li>
					) : null,
					...(showComplementaryButton
						? [
								<li id="complementary" key="compl">
									<a
										href="#/"
										onClick={() => this.setState({ showComplementary: true })}
									>
										<i className="fa fa-eye" aria-hidden="true" />
										afficher les sources complémentaires
									</a>
								</li>
							]
						: []),
					...(showComplementary ? complementary.map(this.renderRef) : [])
				]}
			</ul>
		)
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
