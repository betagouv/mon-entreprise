import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '@/design-system/buttons'

import { Grid } from '../layout'
import { H3 } from '../typography/heading'
import PopoverWithTrigger, {
	PopoverWithTriggerProps,
} from './PopoverWithTrigger'

type PopoverConfirm = Omit<PopoverWithTriggerProps, 'children'> & {
	cancelLabel?: string
	confirmLabel?: string
	onConfirm: () => void
	children?: ReactElement | string
}

export default function PopoverConfirm({
	children,
	title,
	trigger,
	small,
	cancelLabel: cancelLabelProp,
	confirmLabel: confirmLabelProp,
	onConfirm,
}: PopoverConfirm) {
	const { t } = useTranslation()

	const cancelLabel = cancelLabelProp || t('Annuler')
	const confirmLabel = confirmLabelProp || t('Confirmer')

	return (
		<PopoverWithTrigger trigger={trigger} small={small}>
			{(closePopover) => (
				<div>
					{title && <H3>{title}</H3>}

					<div>{children}</div>

					<StyledGrid container>
						<Grid item>
							<Button light onPress={() => closePopover()}>
								{cancelLabel}
							</Button>
						</Grid>
						<Grid item>
							<Button
								onPress={() => {
									closePopover()
									setTimeout(() => onConfirm())
								}}
							>
								{confirmLabel}
							</Button>
						</Grid>
					</StyledGrid>
				</div>
			)}
		</PopoverWithTrigger>
	)
}

const StyledGrid = styled(Grid)`
	display: flex;
	justify-content: center;
	gap: ${({ theme }) => theme.spacings.md};
	margin-top: ${({ theme }) => theme.spacings.xl};
`
