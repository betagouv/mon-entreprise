import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { ArrowDownIcon, Button } from '@/design-system'

export const BoutonDétail = () => {
	const { t } = useTranslation()

	const scrollToDétails = () =>
		document
			.getElementById('simulation-détail')
			?.scrollIntoView({ behavior: 'smooth' })

	return (
		<StyledButton light color="secondary" size="XS" onPress={scrollToDétails}>
			<ArrowDownIcon />
			{t('components.simulateur.voir-le-détail', 'Voir le détail')}
		</StyledButton>
	)
}

// TODO: vérifier les couleurs une fois #4464 mergée
const StyledButton = styled(Button)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacings.xs};
`
