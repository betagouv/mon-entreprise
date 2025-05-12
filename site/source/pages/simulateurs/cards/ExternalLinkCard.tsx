import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Article } from '@/design-system/card'
import { getUrlDomain } from '@/utils/URLs'

import { ExternalLink } from '../_configs/types'

type Props = {
	externalLink: ExternalLink
}

export default function ExternalLinkCard({
	externalLink: { url, title, description, logo, ctaLabel, ariaLabel },
}: Props) {
	const { t } = useTranslation()

	return (
		<Article
			title={title}
			aria-label={
				ariaLabel ||
				t('Lire la page sur {{ site }}, nouvelle fenêtre.', {
					site: getUrlDomain(url),
				})
			}
			ctaLabel={ctaLabel || t('En savoir plus')}
			href={url}
		>
			{description}
			{logo && <StyledImage src={logo} alt="" />}
		</Article>
	)
}

const StyledImage = styled.img`
	display: block;
	margin-top: ${({ theme }) => theme.spacings.xs};
	max-height: ${({ theme }) => theme.spacings.xxl};
`
