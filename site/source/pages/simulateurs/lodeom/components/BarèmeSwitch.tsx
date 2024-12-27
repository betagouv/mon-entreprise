import { renderToString } from 'react-dom/server'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Body } from '@/design-system/typography/paragraphs'
import { barèmeLodeomDottedName } from '@/hooks/useBarèmeLodeom'
import { useZoneLodeom } from '@/hooks/useZoneLodeom'
import { SimpleField } from '@/pages/assistants/components/Fields'

export default function BarèmeSwitch() {
	const currentZone = useZoneLodeom()
	const { t } = useTranslation()

	return (
		currentZone && (
			<Container>
				<SimpleField
					dottedName={barèmeLodeomDottedName(currentZone)}
					label={renderToString(
						<p>
							<strong>
								{t(
									'pages.simulateurs.lodeom.barème-switch-label',
									'Barème à appliquer :'
								)}
							</strong>
						</p>
					)}
					labelStyle={StyledBody}
				/>
			</Container>
		)
	)
}

const Container = styled.div`
	text-align: left;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	column-gap: ${({ theme }) => theme.spacings.sm};
	width: 100%;
	margin-bottom: -${({ theme }) => theme.spacings.lg};
`
const StyledBody = styled(Body)`
	margin: 0;
	margin-bottom: ${({ theme }) => theme.spacings.md};
`
