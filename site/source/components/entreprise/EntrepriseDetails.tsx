import { ComponentType, ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { styled } from 'styled-components'

import { Body, H3, H4, Strong } from '@/design-system'
import { companyDetailsSelector } from '@/store/selectors/company/companyDetails.selector'

type Props = {
	small?: boolean
	headingTag?: string | ComponentType | undefined
}

export default function EntrepriseDetails({
	small = false,
	headingTag = 'h3',
}: Props) {
	const companyDetails = useSelector(companyDetailsSelector)
	const BodyComponent = small ? BodyWithoutMargin : Body

	const DateDeCréation = () => <Strong>{companyDetails.dateDeCréation}</Strong>
	const Commune = () => <Strong>{companyDetails.commune}</Strong>

	return (
		<>
			<TitleComponent
				data-test-id="currently-selected-company"
				small
				headingTag={headingTag}
			>
				{`${companyDetails.nom} ${companyDetails.siren}`}
			</TitleComponent>
			<BodyComponent>
				<Trans i18nKey="entreprise.détails">
					Entreprise créée le <DateDeCréation /> et domiciliée à <Commune />.
				</Trans>
			</BodyComponent>
		</>
	)
}

type TitleProps = {
	children: ReactNode
	small: boolean
	headingTag: string | ComponentType
}

function TitleComponent({ small, headingTag, children }: TitleProps) {
	return small ? (
		<StyledH3 as={headingTag}>{children}</StyledH3>
	) : (
		<H4 as={headingTag}>{children}</H4>
	)
}

const StyledH3 = styled(H3)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`

const BodyWithoutMargin = styled(Body)`
	margin: ${({ theme }) => theme.spacings.xxs} 0;
`
