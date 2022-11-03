import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { FromBottom } from '@/components/ui/animate'
import { ScrollToTop } from '@/components/utils/Scroll'
import { H1, H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'
import { RootState } from '@/reducers/rootReducer'
import { useSitePaths } from '@/sitePaths'

import { TrackPage } from '../../ATInternetTracking'
import siret from './siret.jpg'

export default function AfterRegistration() {
	const { absoluteSitePaths } = useSitePaths()
	const statutChoisi = useSelector(
		(state: RootState) => state.choixStatutJuridique.companyStatusChoice
	)
	const { t } = useTranslation()
	const isAutoentrepreneur = statutChoisi?.match('auto-entrepreneur')

	return (
		<FromBottom>
			<ScrollToTop />
			<TrackPage name="apres_la_creation" />
			<Link to={absoluteSitePaths.créer.index}>
				<span aria-hidden>←</span> <Trans>Retour à la création</Trans>
			</Link>
			<H1>
				<Trans i18nKey="après.titre">Après la création</Trans>
			</H1>
			<Body>
				<Trans i18nKey="après.intro">
					Une fois votre{' '}
					{{
						statutChoisi: isAutoentrepreneur
							? t('auto-entreprise')
							: statutChoisi ||
							  t('après.entreprise', { defaultValue: 'entreprise' }),
					}}{' '}
					créée, vous recevez les informations suivantes :
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="après.siret.titre">Le numéro SIRET</Trans>
			</H2>
			<Body>
				<Trans i18nKey="après.siret.description">
					Le numéro SIREN <strong>est l'identifiant de votre entreprise</strong>{' '}
					tandis que le numéro SIRET identifie chaque établissement de la même
					entreprise. Le SIRET commence par le SIREN, auquel on ajoute le numéro
					d'établissement (NIC).
				</Trans>
				<br />
				<img src={siret} alt="" style={{ maxWidth: '100%' }} />
			</Body>
			<H2>
				<Trans i18nKey="après.ape.titre">Le code APE</Trans>
			</H2>
			<Body>
				<Trans i18nKey="après.ape.description">
					Le code APE correspond au <strong>secteur d'activité</strong> de votre
					entreprise. Il classifie la branche principale de votre entreprise
					dans la nomenclature nationale d'activités françaises « NAF » (
					<Link
						href="https://www.insee.fr/fr/metadonnees/nafr2/section/A?champRecherche=false"
						aria-label="voir la liste, nouvelle fenêtre"
					>
						voir la liste
					</Link>
					).{' '}
					<span
						style={
							statutChoisi && /auto-entrepreneur|EI/.exec(statutChoisi)
								? { display: 'none' }
								: {}
						}
					>
						Il détermine aussi la convention collective applicable à
						l'entreprise, et en partie le taux de la cotisation accidents du
						travail et maladies professionnelles à payer.
					</span>
					<p>
						En cas de code APE erroné, vous pouvez{' '}
						<Link
							href="https://www.insee.fr/fr/information/2015441"
							aria-label="demander une modification, nouvelle fenêtre"
						>
							demander une modification
						</Link>{' '}
						à l'INSEE.
					</p>
				</Trans>
			</Body>
			<H2>
				<Trans i18nKey="après.kbis.titre">Le Kbis</Trans>
			</H2>
			<Body>
				<Trans i18nKey="après.kbis.description.1">
					C'est le document officiel qui atteste de{' '}
					<strong>l'existence légale d'une entreprise commerciale</strong>. Le
					plus souvent, pour être valable par les procédures administratives, il
					doit dater de moins de 3 mois.{' '}
					<Link
						href="https://www.service-public.fr/professionnels-entreprises/vosdroits/F21000"
						aria-label="Plus d'infos, voir plus d'informations sur service-public.fr, nouvelle fenêtre"
					>
						Plus d'infos.
					</Link>
				</Trans>
			</Body>
			<Body>
				<Trans i18nKey="après.kbis.description.2">
					Ce document est généralement demandé lors de la candidature à un appel
					d'offre public, de l'ouverture d'un compte bancaire, d'achats
					d'équipement professionnel auprès de fournisseurs, etc.
				</Trans>
			</Body>
		</FromBottom>
	)
}
