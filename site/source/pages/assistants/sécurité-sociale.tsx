import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { TrackPage } from '@/components/ATInternetTracking'
import { FromBottom } from '@/components/ui/animate'
import FoldingMessage from '@/components/ui/FoldingMessage'
import DefaultHelmet from '@/components/utils/DefaultHelmet'
import { H1, H2 } from '@/design-system/typography/heading'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

import Video from './components/Video'

export default function SocialSecurity() {
	const { t } = useTranslation()

	return (
		<>
			<DefaultHelmet>
				<title>{t('sécu.page.titre', 'Sécurité sociale')}</title>
			</DefaultHelmet>

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
				<StyledFoldingMessage
					title={t('sécu.videoTranscriptTitle', 'Transcription de la vidéo')}
					unfoldButtonLabel={t('Afficher la transcription')}
				>
					<Trans i18nKey="sécu.transcript-NO_AUTO_TRANSLATION">
						<Body>
							Trois minutes pour comprendre les enjeux de la sécurité sociale.
						</Body>

						<Body>
							La sécurité sociale a pour objectif de protéger les personnes qui
							résident en France face à certains événements qui surviennent tout
							au long de leur vie.
						</Body>

						<Body>
							Son budget est composé de dépenses principalement sous la forme de
							prestations et de recettes alimentées en partie par les
							cotisations.
						</Body>

						<Body>
							Les recettes sont gérées par la branche recouvrement composée des
							Urssaf.
						</Body>

						<Body>Pour les dépenses, il existe 5 branches :</Body>
						<Ul>
							<Li>
								La branche maladie permet de couvrir les dépenses
								d'hospitalisation, de médicaments et consultations des
								professionnels de santé, ainsi que le paiement des indemnités
								journalières en cas d'arrêt de travail.
							</Li>
							<Li>
								La branche retraite prend en charge l'inscription des revenus
								sur le compte vieillesse de chacun, tout au long de sa vie
								active, à partir des déclarations internet des entreprises, ce
								qui lui permet ensuite de calculer le montant des retraites et
								de les verser.
							</Li>
							<Li>
								La branche accident du travail prend en charge les frais liés
								aux maladies professionnelles et aux accidents du travail.
							</Li>
							<Li>
								La branche famille verse différents types de prestations liées à
								la naissance, à la garde d'enfants, au logement ou à la
								solidarité, comme la gestion du RSA par exemple.
							</Li>
							<Li>
								La branche autonomie garantit l'équité territoriale, la qualité
								et l'efficience de l'accompagnement des personnes âgées et des
								personnes handicapées, quelle que soit leur lieu de vie.
							</Li>
						</Ul>

						<Body>
							Ces six branches forment le régime général de la sécurité sociale.
							Le régime agricole MSA et des régimes spéciaux viennent s'ajouter.
						</Body>
						<Body>
							Toutes les personnes qui résident en France contribuent au
							financement de la sécurité sociale qui en retour couvre toute la
							population. Le principe est celui du pot commun fonctionnant par
							solidarité, le montant de la contribution versé par chaque
							personne ne dépend pas de ses propres risques mais de ses revenus.
						</Body>
						<Body>
							La sécurité sociale développe également de nouveaux services,
							comme l'ouverture de places d'accueil pour les jeunes enfants, ce
							qui permet à leurs parents de continuer à travailler. Elle
							développe aussi des actions de prévention, organise des campagnes
							de vaccination, de dépistage précoce de certaines maladies, des
							actions d'accompagnement au retour à domicile après
							hospitalisation et aide les particuliers pour déclarer leur garde
							d'enfants ou leurs services à domicile.
						</Body>
						<Body>
							Née en 1945, la sécurité sociale a permis aux Français de vivre
							plus, mais aussi de vivre mieux. Elle continuera à évoluer pour
							construire les services qui correspondent à leurs besoins.
						</Body>
					</Trans>
				</StyledFoldingMessage>
			</FromBottom>
		</>
	)
}

const StyledFoldingMessage = styled(FoldingMessage)`
	margin-top: 2rem;
`
