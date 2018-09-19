/* @flow */
// eslint-disable-next-line no-unused-vars
import React from 'react'
import type { LegalStatus } from 'Selectors/companyStatusSelectors'

type Props = {
	status: LegalStatus
}

const StatusDescription = ({ status }: Props) =>
	status === 'EI' ? (
		<>
			Companies with EI status are also called company in own name or company in
			a personal name. No capital contribution is necessary. Private wealth and
			corporate wealth are one.
		</>
	) : status === 'EIRL' ? (
		<>
			The EIRL status allows you to protect your personal assets by assigning a
			specific heritage to your professional activity.
		</>
	) : status === 'EURL' ? (
		<>
			Companies with EURL status only have one partner. Liability is limited to
			the amount of his contribution to the capital.
		</>
	) : status.includes('SARL') ? (
		<>
			Companies with SARL status are composed of at least 2 partners whose
			financial responsibility is limited to the amount of their contribution to
			the company's capital. The minimum capital is freely fixed in the articles
			of association.
		</>
	) : status === 'SAS' ? (
		<>
			Companies with SAS status are composed of at least 2 associates. The
			financial responsibility of the partners is limited to the amount of their
			contribution to the company's capital. The minimum capital is freely fixed
			in the articles of association.
		</>
	) : status === 'SASU' ? (
		<>
			Companies with SASU status are composed of only one associate. The
			financial responsibility is limited to the amount of his contribution to
			the company's capital. The minimum capital is freely fixed in the
			statutes.
		</>
	) : status === 'SA' ? (
		<>
			Companies with SA status are composed of at least 2 shareholders. This is
			the only status that allows you to be listed on the stock exchange (from 7
			shareholders). The minimum share capital is €37.000.
		</>
	) : status === 'SNC' ? (
		<>
			In a company with the SNC status, the liability of the partners for the
			debts of the company is unified (one partner only can be sued for the
			entire debt) and indefinite (responsible on the entirety of their
			personnal wealth).
		</>
	) : status.toLowerCase().includes['micro-enterprise'] ? (
		<>
			The micro-enterprise is a sole proprietorship company, subject to a
			flat-rate scheme for the calculation of taxes and the payment of social
			security contributions.{' '}
		</>
	) : /* Otherwise */ null

export default StatusDescription
