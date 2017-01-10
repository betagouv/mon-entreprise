import React, { Component } from 'react'
import {analyseSituation, variableType} from '../traverse'
import './CDD.css'

export default class CDD extends Component {
	state = {
		situation: {}
	}
	render() {

		let [missingVariable] = analyseSituation(this.state.situation)
		let type = variableType(missingVariable)

		return (
			<div id="sim">
				<section id="introduction">
					<p>
						Le CDD en France est un contrat d'exception au CDI. On y a donc recours sous certaines conditions seulement. Cet outil vous aidera à respecter ces conditions et à calculer le prix mensuel de l'embauche, qui en dépend, en vous proposant une suite de questions.

						Ici, vous avez le droit de ne pas savoir : certaines questions sont complexes, elles seront toujours accompagnées d'une aide contextuelle. Si ce n'est pas le cas, engueulez-nous* !
					</p>
					<p>
						*: écrivez à contact@contact.contact (on fera mieux après). La loi française est complexe, souvent à raison. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
					</p>
				</section>
				<div id="conversation">
					<section id="questions-answers">
						<form onSubmit={e => e.preventDefault()}>
							<label>
								{missingVariable}
								<input type="text"
									value={this.state.value}
									onChange={e => this.setState({situation: {[missingVariable]: true}}) } />
							</label>
							<input type="submit" value="Submit" />
						</form>
					</section>
					<section id="help">
						Aide
					</section>
				</div>
				<section id="results">
					Résultats
				</section>
			</div>
		)
	}
}

/* TODO Problèmes à résoudre :

- exprimer la justification du CDD d'usage au delà des secteurs.
" l'usage exclut le recours au CDI en raison de la nature de l'activité et du caractère temporaire de ces emplois."
+ interdictions explicites (grève et travaux dangereux)

*/
