import { Trans, useTranslation } from 'react-i18next'

import { PopoverWithTrigger } from '@/design-system'
import { H2 } from '@/design-system/typography/heading'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body } from '@/design-system/typography/paragraphs'

export default function TermsOfUse() {
	const { t } = useTranslation()

	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<Link {...buttonProps} aria-haspopup="dialog" noUnderline>
					{t('termsOfUse.title', "Conditions générales d'utilisation")}
				</Link>
			)}
			title={t('termsOfUse.title', "Conditions générales d'utilisation")}
		>
			<Body>
				{t(
					'termsOfUse.intro',
					"Les présentes conditions générales d'utilisation fixent le cadre juridique de la plateforme numérique « mon-entreprise » et définissent les conditions d'accès et d'utilisation des services proposés aux utilisateurs et utilisatrices."
				)}
			</Body>
			<H2>
				{t('termsOfUse.article.1.title', "Article 1 - Champ d'application")}
			</H2>
			<Body>
				{t(
					'termsOfUse.article.1.content',
					"Le présent document a pour objectif d'encadrer l'utilisation des Services, en accès libre et gratuit à tout Utilisateur. Toute utilisation des Services est subordonnée au respect intégral des présentes conditions générales d'utilisation."
				)}
			</Body>

			<H2>{t('termsOfUse.article.2.title', 'Article 2 - Définitions')}</H2>
			<Body>
				{t(
					'termsOfUse.article.2.content.1',
					"« Éditeur » désigne l'Agence centrale des organismes de sécurité sociale (Acoss) qui est à l'initiative de la Plateforme."
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.2.content.2',
					'« Plateforme » désigne le service numérique « mon-entreprise ».'
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.2.content.3',
					'« Services » désigne les fonctionnalités offertes par la Plateforme pour répondre à ses finalités.'
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.2.content.4',
					'« Utilisateur » désigne toute personne physique qui utilise les Services de la Plateforme.'
				)}
			</Body>

			<H2>{t('termsOfUse.article.3.title', 'Article 3 - Objet')}</H2>
			<Body>
				{t(
					'termsOfUse.article.3.content',
					"La Plateforme a pour objectif de proposer des simulateurs pour accompagner les créateurs et créatrices d'entreprise dans le développement de leur activité. Ces simulateurs affichent des résultats personnalisés et fiables, couvrant un grand nombre de cas spécifiques."
				)}
			</Body>
			<H2>{t('termsOfUse.article.4.title', 'Article 4 - Fonctionnalités')}</H2>
			<Body>
				{t(
					'termsOfUse.article.4.content.1',
					"Il n'existe pas de compte sur la Plateforme. Chaque Utilisateur peut librement et gratuitement, sans s'inscrire ou se connecter, bénéficier des simulateurs pour obtenir des indications sur la création et la gestion d'entreprise."
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.4.content.2',
					"L'Utilisateur peut découvrir la liste de tous les simulateurs qui existent à date sur la Plateforme. Il peut notamment, à l'aide d'une barre de recherche, renseigner le nom de l'entreprise, le SIREN ou SIRET, des mots clés ou acronymes pour trouver le simulateur le plus adapté à sa situation."
				)}
			</Body>
			<Body>
				<Trans i18nKey="termsOfUse.article.4.content.3">
					L'Utilisateur peut également :
					<Ul>
						<Li>
							Intégrer l'un des simulateurs de la Plateforme sur son propre site
							;
						</Li>
						<Li>
							Utiliser les simulateurs via l'API REST dans ses propres services
							;
						</Li>
						<Li>Utiliser les simulateurs dans des fichiers Excel/Sheets ;</Li>
						<Li>
							Réutiliser les calculs de la Plateforme sur son propre site grâce
							à une librairie de calcul ;
						</Li>
						<Li>Découvrir le langage déclaratif « Publicodes » ;</Li>
						<Li>
							Contribuer sur GitHub puisque le code source de la Plateforme est
							ouvert.
						</Li>
					</Ul>
				</Trans>
			</Body>
			<H2>{t('termsOfUse.article.5.title', 'Article 5 - Responsabilités')}</H2>
			<Body>
				{t(
					'termsOfUse.article.5.content.1',
					"Les sources des informations diffusées sur la Plateforme sont réputées fiables mais l'Éditeur ne garantit pas qu'elle soit exempte de défauts, d'erreurs ou d'omissions."
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.5.content.2',
					"L'Éditeur s'engage à la sécurisation du Service, notamment en prenant toutes les mesures nécessaires permettant de garantir la sécurité et la confidentialité des informations fournies. Il fournit notamment les moyens nécessaires et raisonnables pour assurer un accès continu, sans contrepartie financière, au Service."
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.5.content.3',
					"L'Éditeur ne peut être tenu responsable des pertes et/ou préjudices, de quelque nature qu'ils soient, qui pourraient être causés à la suite d'un dysfonctionnement ou d'une indisponibilité du Service. De telles situations n'ouvriront droit à aucune compensation ou indemnité d'aucune nature dont financière."
				)}
			</Body>
			<Body>
				{t(
					'termsOfUse.article.5.content.4',
					"L'Éditeur enrichit au fur et à mesure les simulateurs. La responsabilité de l'Éditeur ne peut en aucun cas être recherchée en cas de suppression ou d'indisponibilité de simulateurs ou d'une quelconque source de données."
				)}
			</Body>
			<H2>
				{t(
					'termsOfUse.article.6.title',
					"Article 6 - Mise à jour des conditions générales d'utilisation"
				)}
			</H2>
			<Body>
				{t(
					'termsOfUse.article.6.content',
					"Les termes des présentes conditions générales d'utilisation peuvent être amendés à tout moment, sans préavis, en fonction des modifications apportées à la Plateforme, de l'évolution de la législation ou pour tout autre motif jugé nécessaire."
				)}
			</Body>
		</PopoverWithTrigger>
	)
}
