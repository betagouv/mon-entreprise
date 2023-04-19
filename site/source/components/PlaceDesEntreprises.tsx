import { Suspense, lazy, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { PopoverWithTrigger } from '@/design-system'
import { Button } from '@/design-system/buttons'
import { Emoji } from '@/design-system/emoji'
import { Loader } from '@/design-system/icons/Loader'
import { Body } from '@/design-system/typography/paragraphs'

const LazyIframe = lazy(async () => {
	return import('./PlaceDesEntreprisesIframe').then(
		({ PlaceDesEntreprisesIframe }) => ({
			default: PlaceDesEntreprisesIframe,
		})
	)
})

const Container = styled.div`
	display: flex;
	justify-content: center;
`

const ButtonLabel = styled.span`
	margin-left: 1rem;
`

export const PlaceDesEntreprisesButton = ({
	pathname,
	siret,
}: {
	pathname: string
	siret?: string | null
}) => {
	const { t } = useTranslation()
	const baseURL =
		'https://' +
		(IS_PRODUCTION
			? 'place-des-entreprises.beta.gouv.fr'
			: 'reso-staging.osc-fr1.scalingo.io')
	const url = new URL(baseURL + pathname)

	const contentRef = useRef<HTMLDivElement>(null)

	const scrollTo = (x: number, y: number) => {
		contentRef.current?.scrollTo(x, y)
	}

	if (siret) {
		url.searchParams.set('siret', siret)
	}

	return (
		<Container>
			<PopoverWithTrigger
				title={t('Échanger avec un conseiller')}
				trigger={(props) => (
					<Button {...props} light size="XS" aria-haspopup="dialog">
						<Emoji emoji="📞" />
						<ButtonLabel>{t('Échanger avec un conseiller')}</ButtonLabel>
					</Button>
				)}
				contentRef={contentRef}
			>
				{(close) => (
					<>
						<Body>
							<Trans>
								Décrivez votre projet ou votre problème en donnant quelques
								éléments de contexte. Notre partenaire Place des Entrprises
								identifiera, parmi l’ensemble des partenaires publics et
								parapublics, le conseiller compétent pour votre demande.
								Celui-ci vous contactera par téléphone sous 5 jours et vous
								accompagnera en fonction de votre situation.
							</Trans>
						</Body>

						<Suspense
							fallback={
								<Container
									css={`
										height: 300px;
										align-items: center;
									`}
								>
									<Loader />
								</Container>
							}
						>
							<LazyIframe
								src={url.href}
								onLoad={function () {
									console.log('iframe loaded')

									document.getElementById('pdeIframe')?.focus()
									scrollTo(0, 0)

									console.log('done!')
								}}
							/>
						</Suspense>

						<Body style={{ textAlign: 'right' }}>
							<Button aria-label={t('Fermer')} size="XS" onPress={close}>
								{t('Fermer')}
							</Button>
						</Body>
					</>
				)}
			</PopoverWithTrigger>
		</Container>
	)
}
