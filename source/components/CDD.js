import React, { Component } from 'react'
import {analyseSituation} from '../traverse'

export default class CDD extends Component {
	render() {
		return (
			<div>
				<section id="introduction">
					<p>
						Le CDD en France est un contrat d'exception au CDI. On y a donc recours sous certaines conditions seulement. Cet outil vous aidera à respecter ces conditions et à calculer le prix mensuel de l'embauche, qui en dépend, en vous proposant une suite de questions.

						Ici, vous avez le droit de ne pas savoir : certaines questions sont complexes, elles seront toujours accompagnées d'une aide contextuelle. Si ce n'est pas le cas, engueulez-nous* !
					</p>
					<p>
						*: écrivez à contact@contact.contact (on fera mieux après). La loi française est complexe, souvent à raison. Nous ne la changerons pas, mais pouvons la rendre plus transparente.
					</p>
				</section>
				<section id="discussion">
					<ul>
					{analyseSituation().map(v =>
						<li key={v}>
							{v}
						</li>
					)}
					</ul>
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
