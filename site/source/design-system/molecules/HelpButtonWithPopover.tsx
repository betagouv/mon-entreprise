import React, { ReactNode } from 'react'
import { Trans } from 'react-i18next'
import { styled } from 'styled-components'

import { Button } from '../buttons/Button'
import { PopoverWithTrigger } from '../popover/PopoverWithTrigger'

type HelpButtonProps = {
	type: 'aide' | 'info'
	title: string
	description?: string | ReactNode
	light?: boolean
	bigPopover?: boolean
	children: React.ReactNode
	className?: string
	onClick?: () => void
	'aria-label'?: string
}

export function HelpButtonWithPopover({
	children,
	title,
	type,
	light,
	bigPopover,
	className,
	onClick,
	'aria-label': ariaLabel,
}: HelpButtonProps) {
	return (
		<PopoverWithTrigger
			trigger={(buttonProps) => (
				<StyledButton
					$light={light}
					className={className}
					aria-haspopup="dialog"
					aria-label={ariaLabel}
					onPress={onClick}
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...buttonProps}
				>
					<CircleIcon aria-hidden width="24" height="24" viewBox="0 0 24 24">
						{type === 'info' ? (
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M12.0248 22.0001C17.5338 22.0001 21.9998 17.5341 21.9998 12.025C21.9998 6.51601 17.5338 2.05005 12.0248 2.05005C6.51576 2.05005 2.0498 6.51601 2.0498 12.0251C2.04981 17.5341 6.51577 22.0001 12.0248 22.0001ZM11.9998 17.6501C12.5521 17.6501 12.9998 17.2023 12.9998 16.6501V10.9501C12.9998 10.3978 12.5521 9.95005 11.9998 9.95005C11.4475 9.95005 10.9998 10.3978 10.9998 10.9501V16.6501C10.9998 17.2023 11.4475 17.6501 11.9998 17.6501ZM11.9998 6.45005C11.4475 6.45005 10.9998 6.89777 10.9998 7.45005C10.9998 8.00234 11.4475 8.45005 11.9998 8.45005C12.5521 8.45005 12.9998 8.00234 12.9998 7.45005C12.9998 6.89777 12.5521 6.45005 11.9998 6.45005Z"
							/>
						) : (
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12.9725 16.5886C12.9725 17.1472 12.5197 17.6 11.9612 17.6C11.4026 17.6 10.9498 17.1472 10.9498 16.5886C10.9498 16.0301 11.4026 15.5772 11.9612 15.5772C12.5197 15.5772 12.9725 16.0301 12.9725 16.5886ZM10.6146 9.25871C10.6784 9.05633 10.7844 8.86166 10.9534 8.71892C11.1062 8.58978 11.3903 8.43428 11.949 8.43296L11.9495 8.43297C11.9552 8.43316 11.9681 8.43369 11.9873 8.43506C12.0261 8.43782 12.088 8.44382 12.165 8.4566C12.3237 8.48295 12.5199 8.53377 12.7037 8.62531C12.8836 8.71493 13.0322 8.83327 13.138 8.9913C13.2394 9.14281 13.3416 9.38993 13.3416 9.80899C13.3416 10.1472 13.1563 10.4615 12.8509 10.747C12.7055 10.8829 12.5563 10.989 12.4428 11.0609C12.387 11.0962 12.3424 11.1216 12.3147 11.1368L12.3005 11.1444C11.704 11.4042 11.3207 11.8034 11.1131 12.2523C10.9193 12.6712 10.9196 13.0527 10.9198 13.1824L10.9198 13.1912V13.5544C10.9198 14.113 11.3726 14.5658 11.9312 14.5658C12.4897 14.5658 12.9426 14.113 12.9426 13.5544V13.1912C12.9426 13.115 12.9473 13.1049 12.9489 13.1017L12.949 13.1014L12.9492 13.101L12.9502 13.0995C12.9512 13.0981 12.9547 13.0933 12.9627 13.0858C12.9775 13.0718 13.0214 13.0352 13.1209 12.9935C13.1372 12.9867 13.1534 12.9794 13.1693 12.9717L12.7301 12.0607C13.1693 12.9717 13.1696 12.9716 13.17 12.9714L13.1707 12.9711L13.1722 12.9703L13.1758 12.9686L13.1847 12.9642L13.2095 12.9517C13.229 12.9417 13.2545 12.9283 13.285 12.9116C13.3461 12.8782 13.4283 12.831 13.5246 12.7701C13.7154 12.6493 13.9719 12.468 14.2322 12.2247C14.7383 11.7516 15.3644 10.9401 15.3644 9.80899C15.3644 9.03433 15.167 8.38616 14.819 7.8662C14.4754 7.35277 14.0247 7.02346 13.6054 6.81465C13.19 6.60776 12.7869 6.50937 12.4963 6.46111C12.3485 6.43659 12.2232 6.42394 12.1309 6.41737C12.0846 6.41407 12.046 6.41227 12.0166 6.41129C12.0019 6.4108 11.9894 6.41052 11.9793 6.41036L11.9659 6.41019L11.9605 6.41016L11.9582 6.41016L11.9571 6.41015C11.9566 6.41015 11.9561 6.41015 11.9561 7.42155V6.41015C10.9764 6.41015 10.2108 6.69811 9.64782 7.17384C9.10024 7.63652 8.82473 8.20846 8.68535 8.65082C8.51749 9.18358 8.8133 9.75155 9.34606 9.91941C9.87882 10.0873 10.4468 9.79147 10.6146 9.25871ZM12.2868 11.1516L12.2872 11.1513C12.2851 11.1524 12.2843 11.1528 12.2849 11.1525L12.2868 11.1516Z"
							/>
						)}
					</CircleIcon>

					{type === 'aide' ? <Trans>aide</Trans> : <Trans>info</Trans>}
				</StyledButton>
			)}
			title={title}
			small={!bigPopover}
		>
			{children}
		</PopoverWithTrigger>
	)
}

const CircleIcon = styled.svg`
	width: ${({ theme }) => theme.spacings.md};
	height: ${({ theme }) => theme.spacings.md};
	path {
		fill: ${({ theme }) => theme.colors.bases.primary[600]};
	}
	margin-right: ${({ theme }) => theme.spacings.xxs};
`

const StyledButton = styled(Button)<{ $light?: boolean }>`
	--padding: 2px;
	&& {
		height: calc(${({ theme }) => theme.spacings.md} + 2 * var(--padding));
		padding: 0;
		vertical-align: middle;
		padding-left: var(--padding);
		padding-right: ${({ theme }) => theme.spacings.xs};
		width: auto;
		font-size: 0.875rem;
		line-height: 1.25rem;
		vertical-align: baseline;
		text-transform: capitalize;
		font-weight: 700;
		display: inline-flex;
		margin-left: ${({ theme }) => theme.spacings.sm};
		align-items: center;
		color: ${({ theme }) => theme.colors.bases.primary[600]} !important;
		border: 1px solid ${({ theme }) => theme.colors.bases.primary[600]};
		background-color: ${({ theme, $light }) =>
			$light
				? theme.colors.extended.grey[100]
				: theme.colors.bases.primary[100]};
		border-radius: calc(
			(${({ theme }) => theme.spacings.md}) / 2 + var(--padding)
		);

		&:hover {
			background-color: ${({ theme }) => theme.colors.bases.primary[200]};
		}
	}
`
