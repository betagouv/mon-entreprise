import { useCallback, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import {
	Body,
	Checkbox,
	H2,
	Li,
	Link,
	PopoverWithTrigger,
	SmallBody,
	StyledLink,
	Ul,
} from '@/design-system'

import * as safeLocalStorage from '../../../storage/safeLocalStorage'
import { TrackPage, useTracking } from '../../ATInternetTracking'

const StyledTable = styled.table`
	&,
	th,
	td {
		border: 1px solid rgba(0, 0, 0, 0.85);
		border-collapse: collapse;
	}
	th {
		text-align: left;
	}
	th,
	td {
		padding: ${({ theme }) => `${theme.spacings.sm} ${theme.spacings.md}`};
	}
`

export default function PrivacyPolicy({
	label,
	noUnderline = true,
}: {
	label?: string
	noUnderline?: boolean
}) {
	const tracker = useTracking()
	const [valueChanged, setValueChanged] = useState(false)
	const { t } = useTranslation()

	const handleChange = useCallback(
		(checked: boolean) => {
			if (checked) {
				tracker?.consent.setMode('opt-out')
				safeLocalStorage.setItem('tracking:do_not_track', '1')
			} else {
				tracker?.consent.setMode('essential')
				safeLocalStorage.setItem('tracking:do_not_track', '0')
			}
			setValueChanged(true)
		},
		[setValueChanged, tracker?.consent]
	)

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline={noUnderline}>
					{label ?? t('privacyPolicy.title', 'Politique de confidentialité')}
				</Link>
			)}
			title={t('privacyPolicy.title', 'Politique de confidentialité')}
		>
			<TrackPage chapter1="informations" name={'donnees_personnelles'} />
			<H2>
				{t(
					'privacyPolicy.liability.title',
					'Qui est responsable de mon-entreprise ?'
				)}
			</H2>
			<Body>
				<Trans i18nKey="privacyPolicy.liability.content">
					La plateforme mon-entreprise.urssaf.fr est sous la responsabilité de
					l'Agence centrale des organismes de sécurité sociale, également
					appelée « Acoss » ou « Urssaf Caisse nationale ». <br />
					La plateforme propose des simulateurs pour accompagner les créateurs
					d'entreprise dans le développement de leur activité.
				</Trans>
			</Body>
			<H2>
				{t(
					'privacyPolicy.data.title',
					'Quelles données à caractère personnel sont collectées ?'
				)}
			</H2>
			<Body>
				<Trans i18nKey="privacyPolicy.data.content">
					mon-entreprise.urssaf.fr ne traite aucune donnée à caractère personnel
					par le biais des simulateurs ou via un dépôt de cookies ou traceurs.
					Il n'existe pas de compte, seules les informations anonymes
					renseignées lors des simulations sont automatiquement sauvegardées
					dans votre navigateur. <br />
					<br />
					Toutefois, si un utilisateur ou une utilisatrice souhaite devenir «
					beta-testeur » ou « beta-testeuse » pour recevoir des informations sur
					les nouveautés, donner son avis, et participer à des ateliers pour
					améliorer nos services, il ou elle peut s'inscrire via le lien en pied
					de page « Devenir beta-testeur ». Dès lors, sont traitées les données
					suivantes : adresse e-mail, type d'entreprise, type d'activité, type
					d'imposition, code postal, tranche d'âge.Ces données sont conservées
					pour une durée maximale de 2 ans.
					<br />
					<br />
					L'Urssaf Caisse nationale s'engage à ce que la collecte et le
					traitement de vos données, soient conformes à la règlementation en
					matière de protection des données personnelles. À ce titre l'Urssaf
					Caisse nationale vous informe :
					<Ul>
						<Li>
							De la base légale de ce traitement, à savoir votre consentement à
							ce que nous conservions les données précitées ;
						</Li>
						<Li>
							De l'identité et des coordonnées du responsable du traitement de
							vos données : l'Urssaf Caisse nationale, domiciliée 36 rue de
							Valmy - 93108 Montreuil Cedex, représentée par son directeur, M.
							Damien IENTILE ;
						</Li>
						<Li>
							Des coordonnées de la Déléguée à la protection des données : Mme
							la Déléguée à la Protection des données de l'Urssaf Caisse
							nationale, 36 rue de Valmy - 93108 Montreuil Cedex -
							informatiqueetlibertes.acoss@acoss.fr.
						</Li>
					</Ul>
				</Trans>
			</Body>
			<H2>
				{t(
					'privacyPolicy.recipients.title',
					'Qui sont les destinataires de vos données ?'
				)}
			</H2>
			<Body>
				<StyledTable>
					<caption className="sr-only">
						{t(
							'privacyPolicy.recipients.table.caption',
							'Liste des sous-traitants destinataires des données à caractère personnel'
						)}
					</caption>
					<thead>
						<tr>
							<th scope="col">
								{t('privacyPolicy.recipients.table.provider', 'Sous-traitant')}
							</th>
							<th scope="col">
								{t(
									'privacyPolicy.recipients.table.country',
									'Pays destinataire'
								)}
							</th>
							<th scope="col">
								{t(
									'privacyPolicy.recipients.table.processing',
									'Traitement réalisé'
								)}
							</th>
							<th scope="col">
								{t('privacyPolicy.recipients.table.security', 'Garanties')}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Brevo</td>
							<td>France</td>
							<td>
								{t('privacyPolicy.recipients.table.mailer', "Envoi d'e-mails")}
							</td>
							<td>
								<StyledLink
									href="https://www.brevo.com/legal/termsofuse/#annex"
									aria-label="Aller à https://www.brevo.com/legal/termsofuse/#annex, nouvelle fenêtre"
									target="_blank"
									rel="noreferrer"
								>
									https://www.brevo.com/legal/termsofuse/#annex
								</StyledLink>
							</td>
						</tr>
						<tr>
							<td>Crisp</td>
							<td>France</td>
							<td>
								{t(
									'privacyPolicy.recipients.table.support',
									'Outil de support'
								)}
							</td>
							<td>
								<StyledLink
									href="https://crisp.chat/fr/privacy/"
									aria-label="Aller à https://crisp.chat/fr/privacy/, nouvelle fenêtre"
									target="_blank"
									rel="noreferrer"
								>
									https://crisp.chat/fr/privacy/
								</StyledLink>
							</td>
						</tr>
					</tbody>
				</StyledTable>
			</Body>
			<H2>
				{t(
					'privacyPolicy.rights.title',
					'Quels sont les droits Informatiques et liberté que vous pouvez exercer ?'
				)}
			</H2>
			<Body>
				<Trans i18nKey="privacyPolicy.rights.content">
					En application de la réglementation Informatique et libertés, vous
					disposez :
					<Ul>
						<Li>
							De la possibilité de demander si l'Urssaf Caisse nationale détient
							des informations sur vous, et demander que l'Urssaf Caisse
							nationale vous communique l'intégralité de ces données (droit
							d'accès) ;
						</Li>
						<Li>
							Du droit à la limitation du traitement de vos données à caractère
							personnel si vous concéderez que le traitement est illicite ou
							excessif (droit à la limitation du traitement) ;
						</Li>
						<Li>
							De la possibilité de demander la rectification des informations
							inexactes vous concernant (droit de rectification) ;
						</Li>
						<Li>
							De la possibilité de vous opposer, le cas échéant et pour des
							motifs légitimes (droit d'opposition) ;
						</Li>
						<Li>
							De la possibilité de demander, le cas échéant et s'il n'existe pas
							d'obligations légales contraires, que vos données soient effacées
							par l'Urssaf Caisse nationale (droit à l'oubli) ;
						</Li>
						<Li>
							De la possibilité de définir le sort de vos données après votre
							décès.
						</Li>
					</Ul>
					Tous ces droits s'exercent auprès de la Déléguée à la Protection des
					Données de l'Urssaf Caisse nationale, par email à l'adresse{' '}
					<StyledLink
						href="mailto:informatiqueetlibertes.acoss@acoss.fr"
						aria-label="Envoyer un mail à informatiqueetlibertes.acoss@acoss.fr"
						target="_blank"
						rel="noreferrer"
					>
						informatiqueetlibertes.acoss@acoss.fr
					</StyledLink>{' '}
					ou par courrier postal à l'adresse suivante : Urssaf Caisse nationale,
					Informatique et Libertés, 36 rue de Valmy, 93108 Montreuil Cedex ; en
					justifiant dans les deux cas de son identité conformément à l'article
					77 du décret n°2019-536 du 29 mai 2019.
					<br />
					Pour toute information complémentaire ou réclamation, vous pouvez
					contacter la Commission Nationale de l'Informatique et des Libertés
					(CNIL).
				</Trans>
			</Body>
			<H2>
				{t(
					'privacyPolicy.security.title',
					'Comment la sécurité de vos données est-elle assurée ?'
				)}
			</H2>
			<Body>
				{t(
					'privacyPolicy.security.content',
					'Vos données personnelles recueillies dans le cadre des services proposés sur mon-entreprise.urssaf.fr sont traitées selon des protocoles sécurisés, à la fois informatiques et physiques.'
				)}
			</Body>
			<H2>{t('privacyPolicy.tracking.title', 'Cookies et traceurs')}</H2>
			<Body>
				<Trans i18nKey="privacyPolicy.tracking.content">
					mon-entreprise.urssaf.fr ne dépose pas de cookies ou de traceurs.
					Cependant, la plateforme utilise Piano Analytics, une solution de
					mesure d'audience, configurée en mode « exempté » et ne nécessitant
					pas le recueil du consentement des personnes concernées conformément
					aux{' '}
					<StyledLink
						href="https://www.cnil.fr/fr/solutions-pour-les-cookies-de-mesure-daudience"
						aria-label={t(
							'privacyPolicy.tracking.ariaLabel',
							"recommandations de la CNIL, voir plus d'informations à ce sujet sur le site de la CNIL, nouvelle fenêtre"
						)}
						target="_blank"
						rel="noreferrer"
					>
						recommandations de la CNIL
					</StyledLink>
					.
				</Trans>
			</Body>

			<Body>
				{t(
					'privacyPolicy.tracking.optOut.content',
					"Vous pouvez vous soustraire de cette mesure d'utilisation de la plateforme en cochant la case correspondante ci-dessous :"
				)}
			</Body>
			<Body>
				<Checkbox
					id="opt-out-mesure-audience"
					name="opt-out mesure audience"
					onChange={handleChange}
					defaultSelected={tracker?.consent.getMode().name === 'opt-out'}
				>
					{t(
						'privacyPolicy.tracking.optOut.checkboxLabel',
						"Je ne veux pas envoyer de données anonymes sur mon utilisation de la plateforme à des fins de mesures d'audience."
					)}
				</Checkbox>
			</Body>
			{valueChanged && (
				<SmallBody>
					<Trans i18nKey="privacyPolicy.tracking.optOut.confirmation">
						Vos préférences ont bien été enregistrées
					</Trans>
				</SmallBody>
			)}
		</PopoverWithTrigger>
	)
}
