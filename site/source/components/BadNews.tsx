import { Trans, useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import missedChance from '@/assets/images/missed_chance.svg'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Li, Ul } from '@/design-system/typography/list'
import { Body, SmallBody } from '@/design-system/typography/paragraphs'
import { useSitePaths } from '@/sitePaths'

export default function BadNews() {
	const { t } = useTranslation()
	const { absoluteSitePaths } = useSitePaths()

	return (
		<aside
			aria-label={t('badnews.label', 'Information importante')}
			style={{
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Message
				className="print-hidden"
				type="error"
				icon={<Emoji emoji="💔" />}
				mini
				border={false}
			>
				<Body>
					<Trans i18nKey="badnews.body">
						<strong>Important :</strong> La mise à jour des simulateurs et le
						support utilisateur ne sont plus assurés.{' '}
						<PopoverWithTrigger
							small
							title={'Interruption du service'}
							trigger={(props) => (
								<Link {...props}>
									<Trans>En savoir plus.</Trans>
								</Link>
							)}
						>
							<Body>
								L'équipe qui opérait les simulateurs et les assistants de
								mon-entreprise.urssaf.fr depuis plus de cinq ans a pris la
								décision d'arrêter son travail. En voici l'explication :
							</Body>
							<Ul>
								<Li>
									L'équipe est composée de{' '}
									<Strong>deux développeurs indépendants</Strong> (travailleurs
									non salariés) ;
								</Li>
								<Li>
									Le paiement de leurs factures est bloqué{' '}
									<Strong>depuis avril</Strong> ;
								</Li>
								<Li>
									Le budget de développement du site, financé en totalité par
									l'Urssaf, est en{' '}
									<Link to={absoluteSitePaths.budget}>
										forte baisse pour 2023
									</Link>
									, alors que{' '}
									<Link to={absoluteSitePaths.stats}>
										son usage est en forte hausse
									</Link>
									.
								</Li>
								<Li>
									Ce budget n'est <Strong>pas suffisant</Strong> pour faire
									travailler l'équipe sur l'année complète et continuer à
									développer le produit.
								</Li>
							</Ul>

							<Body>
								Cette situation est <Strong>temporaire</Strong>, et devrait{' '}
								<Strong>revenir à la normale</Strong> dans les prochains mois.
								Veuillez nous excuser pour la gêne occasionnée.
							</Body>
							<StyledImg src={missedChance} aria-hidden alt="" />
							<SmallBody $grey>
								P.S de l'équipe : On vous le dit sincèrement, ça été très dur de
								prendre cette décision. On aurait aimé continuer à faire évoluer
								ce site comme on l'a fait toutes ces années. Quoi qu'il
								advienne, on part très honoré de voir plus de 500 000 d'entre
								vous utiliser nos outils chaque mois !
							</SmallBody>
						</PopoverWithTrigger>
					</Trans>
				</Body>
			</Message>
		</aside>
	)
}

const StyledImg = styled.img`
	margin: 0 auto;
	display: block;
	width: 100%;
	max-width: 300px;
`
