/* @flow */
import { companyIsMicroenterprise } from 'Actions/companyStatusActions'
import { React, T } from 'Components'
import { translate } from 'react-i18next'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { SkipButton } from 'Ui/Button'
import {compose} from 'ramda'

type Props = {
	companyIsMicroenterprise: (?boolean) => void,
	t: (string, string) => string,
}

const Microenterprise = ({ companyIsMicroenterprise, t }: Props) => (
	<>
		<Helmet>
			<title>
				{t('microentreprise.page.titre','Différence entre microentreprise et entreprise individuelle')}
			</title>
			<meta
				name="description"
				content={
					<T k="microentreprise.page.description">
						La micro-entreprise est un système simplifié de déclaration et de
						paiement, pour lesquelles les impôts et cotisations sociales sont
						basés sur le chiffre d'affaires réalisé chaque mois. C'est un choix
						intéressant si vous n'avez pas besoin de beaucoup de capital et que
						vous souhaitez démarrer rapidement.
					</T>
				}
			/>
		</Helmet>
		<h2><T k="microentreprise.titre">Micro-enterprise ou entreprise individuelle (EI) ?</T></h2>
		<T k="microentreprise.description">
     <p>
       La micro-entreprise est un régime simplifié de déclaration et de paiement, 
       pour lequel l'impôt et les cotisations sociales sont basés sur le chiffre d'affaires réalisé chaque mois. 
       Disponible pour les entreprises dont le chiffre d'affaires annuel ne dépasse pas 70.000 € pour les prestataires de services 
       ou 170.000 € lorsque l'activité principale est la vente de biens, la restauration ou la fourniture de logements.
     </p>
     <p>
       C'est un choix intéressant si :
     </p>
     <ul>
       <li>Vous n'avez pas besoin de beaucoup de capital et de dépenses importantes pour mener votre activité</li>
       <li>Vous voulez tester la viabilité de votre modèle, ou prévoyez de rester petits</li>
       <li>Vous voulez la quantité minimale de paperasse pour commencer</li>
     </ul>
     <p>
       <strong>Note</strong> : Certaines activités sont exclus de ce statut (<a href="https://www.afecreation.fr/pid10375/pour-quelles-activites.html#principales-exclusions"> voir la liste</a>). Certaines activités sont réglementées avec une qualification ou une expérience professionnelle (<a href="https://www.afecreation.fr/pid316/activites-reglementees.html">voir la liste</a>).
     </p>
     <p>
       Pour tous les autres cas, il est conseillé de choisir le statut standard, qui est <strong>l'Entreprise Individuelle</strong>.
     </p>
		</T>
		<div className="ui__ answer-group">
			<button
				onClick={() => {
					companyIsMicroenterprise(true)
				}}
				className="ui__ button">
				Micro-enterprise
			</button>
			<button
				onClick={() => {
					companyIsMicroenterprise(false)
				}}
				className="ui__ button">
				Individual Business
			</button>
			<SkipButton onClick={() => companyIsMicroenterprise(null)} />
		</div>
	</>
)

export default compose(translate(), connect(
	null,
	{ companyIsMicroenterprise }
))(Microenterprise)
