/* @flow */
import { React, T } from 'Components'
import { ScrollToTop } from 'Components/utils/Scroll'
import withSitePaths from 'Components/utils/withSitePaths'
import { compose } from 'ramda'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Animate from 'Ui/animate'
import siret from './siret.jpg'
import type { TFunction } from 'react-i18next'

type OwnProps = {}
type Props = {
	companyStatusChoice: string,
	sitePaths: Object,
	t: TFunction
} & OwnProps

const AfterRegistration = ({ t, companyStatusChoice, sitePaths }: Props) => {
	const isAutoentrepreneur = [
		'auto-entrepreneur',
		'auto-entrepreneur-EIRL'
	].includes(companyStatusChoice)
	return (
		<Animate.fromBottom>
			<ScrollToTop />
			<h1>
				<T k="après.titre">Après la création</T>
			</h1>
			<p>
				<T k="après.intro">
					Une fois votre{' '}
					{{
						companyStatusChoice: isAutoentrepreneur
							? t('auto-entreprise')
							: companyStatusChoice || t(['après.entreprise', 'entreprise'])
					}}{' '}
					créée, vous recevez les informations suivantes :
				</T>
			</p>
			<h2>
				<T k="après.siret.titre">Le numéro SIRET</T>
			</h2>
			<p>
				<T k="après.siret.description">
					Le numéro SIREN <strong>est l'identifiant de votre entreprise</strong>{' '}
					tandis que le numéro SIRET identifie chaque établissement de la même
					entreprise. Le SIRET commence par le SIREN, auquel on ajoute le numéro
					d'établissement (NIC).
				</T>
				<br />
				<img
					src={siret}
					alt="SIRET and SIREN number"
					style={{ maxWidth: '100%' }}
				/>
			</p>
			<h2>
				<T k="après.ape.titre">Le code APE</T>
			</h2>
			<p>
				<T k="après.ape.description">
					Le code APE correspond au <strong>secteur d'activité</strong> de votre
					entreprise. Il classifie la branche principale de votre entreprise
					dans la nomenclature nationale d'activités françaises « NAF » (
					<a href="https://www.insee.fr/fr/metadonnees/nafr2/section/A?champRecherche=false">
						voir la liste
					</a>
					).{' '}
					<span
						style={
							companyStatusChoice &&
							companyStatusChoice.match(/auto-entrepreneur|EI/)
								? { display: 'none' }
								: {}
						}>
						Il détermine aussi la convention collective applicable à
						l'entreprise, et en partie le taux de la cotisation accidents du
						travail et maladies professionnelles à payer.
					</span>
					<p>
						En cas de code APE erroné, vous pouvez{' '}
						<a href="https://www.insee.fr/fr/information/2015441">
							demander une modification
						</a>{' '}
						à l'INSEE.
					</p>
				</T>
			</p>
			{companyStatusChoice &&
				!companyStatusChoice.includes('auto-entrepreneur') && (
					<>
						<h2>
							<T k="après.kbis.titre">Le Kbis</T>
						</h2>
						<p>
							<T k="après.kbis.description.1">
								C'est le document officiel qui atteste de{' '}
								<strong>l'existence légale d'une entreprise commerciale</strong>
								. Le plus souvent, pour être valable par les procédures
								administratives, il doit dater de moins de 3 mois.{' '}
								<a href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F21000">
									Plus d'infos.
								</a>
							</T>
						</p>
						<p>
							<T k="après.kbis.description.2">
								Ce document est généralement demandé lors de la candidature à un
								appel d'offre public, de l'ouverture d'un compte bancaire,
								d'achats d'équipement professionnel auprès de fournisseurs, etc.
							</T>
						</p>
					</>
				)}
			<p className="ui__ answer-group">
				<Link
					to={sitePaths.entreprise.index}
					className="ui__ simple skip button left">
					← <T k="après.actions.retour">Démarche de création</T>
				</Link>
				<Link
					to={sitePaths.sécuritéSociale.index}
					className="ui__ plain button">
					<T k="après.actions.avance">Estimez vos cotisations </T>→
				</Link>
			</p>
		</Animate.fromBottom>
	)
}

export default (compose(
	connect(state => ({
		companyStatusChoice: state.inFranceApp.companyStatusChoice
	})),
	withTranslation(),
	withSitePaths
)(AfterRegistration): React$ComponentType<OwnProps>)
