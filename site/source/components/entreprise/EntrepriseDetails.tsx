import { ComponentType, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
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
	const { t } = useTranslation()
	const companyDetails = useSelector(companyDetailsSelector)
	const BodyComponent = small ? BodyWithoutMargin : Body

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
				{t(
					'entreprise.détails',
					'Entreprise créée le {{ date }} et domiciliée à {{ commune }}.',
					{
						date: <Strong>{companyDetails.dateDeCréation}</Strong>,
						commune: <Strong>{companyDetails.commune}</Strong>,
					}
				)}
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
