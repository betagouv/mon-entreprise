import Value, { Condition } from 'Components/EngineValue'
import React from 'react'
import emoji from 'react-easy-emoji'
import { DottedName } from 'Rules'

type AidesCovidProps = {
	rule?: DottedName
}

export default function AidesCovid({rule}: AidesCovidProps) {
	rule ??= "dirigeant . indépendant . cotisations et contributions . aides covid 2020"
	return (
		<div className="ui__ box-container">
			<Condition expression={rule}>
				<div className="ui__ card box">
					<h4>Réduction de cotisations</h4>
					<p
						className="ui__ notice"
						css={`
							flex: 1;
						`}
					>
						Vous pouvez bénéficier de réductions de cotisations exceptionnelles.
					</p>
					<p className="ui__ lead">
						<Value
							displayedUnit="€"
							expression={rule}
						/>
					</p>
				</div>
			</Condition>
			<div className="ui__ card box">
				<h4>Aides gouvernementales</h4>
				<p
					className="ui__ notice"
					css={`
						flex: 1;
					`}
				>
					Le ministère de l'Économie propose un portail recensant les mesures de
					soutien aux entreprises.
				</p>
				<a
					className="ui__ small button"
					href="https://www.economie.gouv.fr/covid19-soutien-entreprises/les-mesures"
					target="_blank"
				>
					{emoji('▶')} Mesures de soutien
				</a>
			</div>
			<div className="ui__ card box">
				<h4>Écoute et soutien</h4>
				<p
					className="ui__ notice"
					css={`
						flex: 1;
					`}
				>
					Une <a>cellule de première écoute et de soutien psychologique</a> a
					été mise en place pour les chefs d'entreprise fragilisés par la crise.
				</p>
				<a className="ui__ small simple button" href="tel:+33805655050">
					{emoji('📞')} 08 05 65 50 50
				</a>
			</div>
		</div>
	)
}
