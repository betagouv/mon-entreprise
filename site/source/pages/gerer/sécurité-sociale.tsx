import { FromBottom } from '@/components/ui/animate'
import { AccompanyingMessage } from '@/design-system/message/index.stories'
import { H1, H2 } from '@/design-system/typography/heading'
import { Body } from '@/design-system/typography/paragraphs'
import { Helmet } from 'react-helmet-async'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { TrackPage } from '../../ATInternetTracking'
import Video from './_components/Video'

export default function SocialSecurity() {
	const { t } = useTranslation()

	return (
		<>
			<Helmet>
				<title>{t('sécu.page.titre', 'Sécurité sociale')}</title>
			</Helmet>

			<FromBottom>
				<TrackPage name="securite_social" />
				<Trans i18nKey="sécu.contenu">
					<H1>Protection sociale </H1>
					<Body>
						En France, tous les travailleurs bénéficient d'une protection
						sociale de qualité. Ce système obligatoire repose sur la solidarité
						et vise à assurer le{' '}
						<strong>bien-être général de la population</strong>.
					</Body>
					<Body>
						En contrepartie du paiement de{' '}
						<strong>contributions sociales</strong>, le cotisant est couvert sur
						la maladie, les accidents du travail, chômage ou encore la retraite.
					</Body>
				</Trans>

				<section style={{ marginTop: '2rem' }}>
					<Trans i18nKey="sécu.videoTitle">
						<H2>
							Vidéo explicative "3 minutes pour comprendre la Sécurité Sociale"
						</H2>
					</Trans>

					<Video />
				</section>
				<StyledAccompagnyingMessage>
					<Trans i18nKey="sécu.transcript">
						<H2>Transcription de la vidéo</H2>
						<Body>
							Trois minutes pour comprendre les enjeux de la sécurité sociale.
						</Body>
						<Body>
							La sécurité sociale a pour objectif de protéger les personnes qui
							résident en France face à certains évènements qui surviennent tout
							au long de leur vie.
						</Body>
						<Body>
							Son budget est composé dépenses principalement sous la forme de
							prestations et de recettes, alimentés en partie par les
							contributions. Les recettes sont gérées bar la branche des
							recouvrements composé des URSSAF. Pour les dépenses, il existe
							quatre branches. La branche Assurance-Maladie permet de couvrir
							les dépenses d’hospitalisation, de médicaments et consultation des
							professionnels de santé. La branche retraite prend en charge
							l’inscription des revenus sur le compte vieillesse de chacun tout
							au long de sa vie active, à partir des déclarations internet des
							entreprises, ce qui permet ensuite de calculer le montant des
							retraites et de les verser. La branche accidents du travail prend
							en charge les frais liés aux maladies professionnelles et aux
							accidents du travail. La branche famille verse différents types de
							prestations liées à la naissance, à la garde d’enfant, aux aides à
							l’éducation ou au logement par exemple. Ces quatre branches
							forment le régime général de la sécurité sociale qui a intégré les
							indépendants le 1er janvier 2018. Des organisations spécifiques
							s’ajoutent au régime général dont la MSA pour les agriculteurs ou
							les régimes spéciaux.
						</Body>
						<Body>
							Toutes les personnes qui résident en France contribuent au
							financement de la sécurité sociale qui en retour couvre toute la
							population. Le principe est celui du "pot-commun" fonctionnant par
							solidarité. Le montant de la contribution versée par chaque
							personne ne dépend pas de ses propres risques, mais de ses
							revenus.
						</Body>
						<Body>
							La sécurité sociale, par l’intermédiaire du versement des
							retraites et de la prise en charge des soins, a permis
							l’allongement de l’espérance de vie de trois mois de plus par an
							depuis 20 ans. Ces progrès entraînent des difficultés de
							financement : l'allongement de la durée de vie implique des
							retraites plus longues et des dépenses de santé plus importante
							qui déséquilibre le système. Pour rééquilibrer le système des
							mesures d'adaptation sont prises notamment sur la durée de
							cotisation.
						</Body>
						<Body>
							La sécurité sociale développe également de nouveaux services comme
							l'ouverture de places d'accueil pour les jeunes enfants ce qui
							permet à leurs parents de continuer à travailler. Elle développe
							aussi des actions de prévention, organise des campagnes de
							vaccination, de dépistage précoce de certaines maladies, des
							actions d'accompagnement au retour à domicile après
							hospitalisation, ainsi que des campagnes d'information et de
							prévention sur les chutes des personnes âgées.
						</Body>
						<Body>
							Née il y a soixante dix ans, la Sécurité Sociale a permis aux
							français de vivre plus, mais aussi mieux elle continuera à évoluer
							pour construire les services qui correspondent à leurs besoins.
						</Body>
					</Trans>
				</StyledAccompagnyingMessage>
			</FromBottom>
		</>
	)
}

const StyledAccompagnyingMessage = styled(AccompanyingMessage)`
	margin-top: 2rem;
`
