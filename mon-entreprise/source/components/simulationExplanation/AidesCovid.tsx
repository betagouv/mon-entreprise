import Value, { Condition } from 'Components/EngineValue'
import emoji from 'react-easy-emoji'
import { Trans } from 'react-i18next'
import { DottedName } from 'Rules'

type AidesCovidProps = {
	aidesRule?: DottedName
}

export default function AidesCovid({ aidesRule }: AidesCovidProps) {
	return (
		<>
			<h2>
				<Trans>Aides Covid-19</Trans>
			</h2>
			<div className="ui__ box-container">
				{aidesRule && (
					<Condition expression={aidesRule}>
						<div className="ui__ card box lighter-bg">
							<Trans i18nKey="simulateurs.explanation.aides covid.reduction">
								<h4>Réduction de cotisations</h4>
								<p className="ui__ notice">
									Vous pouvez bénéficier d'une réduction de vos cotisations
									définitives sur l'année 2020.
								</p>
								<p className="ui__ lead">
									<Value displayedUnit="€" expression={aidesRule} />
								</p>
							</Trans>
						</div>
					</Condition>
				)}
				<Condition expression={'dirigeant . auto-entrepreneur'}>
					<div className="ui__ card box lighter-bg">
						<Trans i18nKey="simulateurs.explanation.aides covid.deduction">
							<h4>Déduction de chiffre d'affaire</h4>
							<p className="ui__ notice">
								Les conditions et modalités de la réduction "covid" sont
								présentées sur le site de l'URSSAF.
							</p>
							<a
								className="ui__ small simple button"
								href="https://www.autoentrepreneur.urssaf.fr/portail/accueil/sinformer-sur-le-statut/toutes-les-actualites/loi-de-finance-rectificative---r.html"
								target="_blank"
							>
								<span>{emoji('▶')}</span> En savoir plus
							</a>
						</Trans>
					</div>
				</Condition>
				<div className="ui__ card box">
					<Trans i18nKey="simulateurs.explanation.aides covid.portail">
						<h4>Aides gouvernementales</h4>
						<p className="ui__ notice">
							Le ministère de l'Économie propose un portail recensant les
							mesures de soutien aux entreprises.
						</p>
						<a
							className="ui__ small simple button"
							href="https://www.economie.gouv.fr/covid19-soutien-entreprises/les-mesures"
							target="_blank"
						>
							<span>{emoji('▶')}</span> Mesures de soutien
						</a>
					</Trans>
				</div>
				<div className="ui__ card box">
					<Trans i18nKey="simulateurs.explanation.aides covid.soutien">
						<h4>Écoute et soutien</h4>
						<p className="ui__ notice">
							Une{' '}
							<a
								href="https://www.economie.gouv.fr/mise-en-place-cellule-ecoute-soutien-psychologique-chefs-entreprise"
								target="_blank"
							>
								cellule de première écoute et de soutien psychologique
							</a>{' '}
							a été mise en place pour les chefs d'entreprise fragilisés par la
							crise.
						</p>
						<a className="ui__ small simple button" href="tel:+33805655050">
							<span>{emoji('📞')}</span> 08 05 65 50 50
						</a>
					</Trans>
				</div>
			</div>
		</>
	)
}
