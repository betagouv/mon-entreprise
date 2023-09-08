import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '@/design-system/buttons'
import { Drawer } from '@/design-system/drawer'
import { Li, Ul } from '@/design-system/typography/list'
import { PlanContent } from '@/pages/Plan'

export const Menu = () => {
	const { t } = useTranslation()

	return (
		<Drawer
			trigger={(buttonProps) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'end',
					}}
				>
					<StyledButton
						size="XS"
						className="print-hidden"
						light
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...buttonProps}
						aria-haspopup="menu"
						aria-label={t(
							'Rechercher, ouvrir la boite de dialogue pour entrer vos termes de recherche.'
						)}
					>
						<StyledSVG
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 96 960 960"
							height="25"
							width="25"
							aria-hidden
							role="img"
						>
							<path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
						</StyledSVG>{' '}
						Menu
					</StyledButton>
				</div>
			)}
		>
			<Nav>
				<StyledUl noMarker>
					<PlanContent />
				</StyledUl>
			</Nav>
		</Drawer>
	)
}

const StyledButton = styled(Button)`
	display: flex;
	flex: 0;
	align-items: center;
	margin-right: ${({ theme }) => theme.spacings.md};
`

const StyledSVG = styled.svg`
	margin-right: ${({ theme }) => theme.spacings.xs};
	path {
		fill: currentColor;
	}
`

const Nav = styled.nav`
	display: flex;
	flex-direction: column;
	margin: 0 -${({ theme }) => theme.spacings.xxl};
`

const StyledUl = styled(Ul)`
	${Li} {
		padding: 0 ${({ theme }) => theme.spacings.sm};
		margin-bottom: ${({ theme }) => theme.spacings.md};

		${Ul} {
			margin-top: ${({ theme }) => theme.spacings.md};
		}

		${Li} {
			padding: 0 ${({ theme }) => theme.spacings.xl};
		}
	}
`
