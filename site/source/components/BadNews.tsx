import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import missedChance from '@/assets/images/missed_chance.svg'
import { Message, PopoverWithTrigger } from '@/design-system'
import { Emoji } from '@/design-system/emoji'
import { Strong } from '@/design-system/typography'
import { Link } from '@/design-system/typography/link'
import { Body } from '@/design-system/typography/paragraphs'

export function BadNews() {
	return (
		<div>
			<Message
				className="print-hidden"
				type="error"
				mini
				border={false}
				style={{ textAlign: 'center' }}
			>
				<Body>
					<Emoji emoji="💔" />
					&nbsp;
					<Trans i18nKey="badnews.body">
						<strong>Annonce :</strong> La mise à jour des simulateurs et le
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
								mon-entreprise.urssaf.fr n'est plus en mesure de continuer à
								développer le site.
							</Body>
							<Body>
								Cette situation est <Strong>temporaire</Strong>, et devrait{' '}
								<Strong>revenir à la normale</Strong> dans les prochains mois.
								Veuillez nous excuser pour la gêne occasionnée.
							</Body>
							<StyledImg src={missedChance} aria-hidden alt="" />
						</PopoverWithTrigger>
					</Trans>
				</Body>
			</Message>
		</div>
	)
}

const StyledImg = styled.img`
	margin: 0 auto;
	display: block;
	width: 100%;
	max-width: 300px;
`
