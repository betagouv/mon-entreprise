/* @flow */
import { React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import { compose } from 'ramda'
import { withI18n } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import sitePaths from '../../sitePaths'
import siret from './siret.jpg'
import type { TFunction } from 'react-i18next'

type Props = {
	companyStatusChoice: string,
	t: TFunction
}

const AfterRegistration = ({ t, companyStatusChoice }: Props) => (
	<Animate.fromBottom>
		<ScrollToTop />
		<h1>
			<T k="après.titre">Après la création</T>
		</h1>
		<p>
			<T k="après.intro">
				Une fois que votre{' '}
				{{
					companyStatusChoice:
						companyStatusChoice || t(['après.entreprise', 'entreprise'])
				}}{' '}
				aura été créée, vous recevrez les informations suivantes :
			</T>
		</p>
		<h2>
			<T k="après.siret.titre">Le numéro Siret</T>
		</h2>
		<p>
			<T k="après.siret.description">
				Le numéro Siren <strong>est l'identifiant de votre entreprise</strong>{' '}
				tandis que le numéro Siret identifie chaque établissement de la même
				entreprise. Le Siret commence par le Siren, auquel on ajoute le numéro
				d'établissement.
			</T>
			<br />
			<img
				src={siret}
				alt="Siret and siren number"
				style={{ maxWidth: '100%' }}
			/>
		</p>
		<h2>
			<T k="après.ape.titre">Le code APE</T>
		</h2>
		<p>
			<T k="après.ape.description">
				Le code APE correspond au <strong>secteur d'activité</strong> de votre
				entreprise. Il classifie la branche principale de votre entreprise dans
				la nomenclature nationale d'activités françaises (code « NAF »).{' '}
				<span
					style={
						companyStatusChoice.match(/micro-entreprise|EI/)
							? { display: 'none' }
							: {}
					}>
					Il détermine aussi la convention collective applicable à l'entreprise,
					et en partie le taux de la cotisation accident du travail et maladies
					professionnelles à payer.
				</span>
			</T>
		</p>
		{!companyStatusChoice.includes('micro-entreprise') && (
			<>
				<h2>
					<T k="après.kbis.titre">Le Kbis</T>
				</h2>
				<p>
					<T k="après.kbis.description.1">
						C'est le document officiel qui atteste de{' '}
						<strong>l'existence légale d'une entreprise commerciale</strong>. Le
						plus souvent, pour être valable par les procédures administratives,
						il doit dater de moins de 3 mois.
					</T>
				</p>
				<p>
					<T k="après.kbis.description.2">
						Ce document est généralement demandé lors de la candidature à un
						appel d'offre public, de l'ouverture d'un compte bancaire, d'achats
						d'équipement professionnel auprès de fournisseurs, etc.
					</T>
				</p>
			</>
		)}
		<p style={{ display: 'flex', justifyContent: 'space-between' }}>
			<Link to={sitePaths().entreprise.index} className="ui__ skip-button left">
				‹ <T k="après.actions.retour">Démarche de création</T>
			</Link>
			<Link to={sitePaths().sécuritéSociale.index} className="ui__ skip-button">
				<T k="après.actions.avance">Sécu et coût d'embauche </T>›
			</Link>
		</p>
	</Animate.fromBottom>
)

export default compose(
	connect(state => ({
		companyStatusChoice: state.inFranceApp.companyStatusChoice
	})),
	withI18n()
)(AfterRegistration)
