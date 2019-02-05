/* @flow */

import Distribution from 'Components/Distribution';
import PaySlip from 'Components/PaySlip';
import React, { Component } from 'react';
import { Trans } from 'react-i18next';

type Props = {
	arePreviousAnswers: boolean,
	conversationStarted: boolean,
	startConversation: () => void,
	period: 'mois' | 'année'
}
export default class SalaryFirstExplanation extends Component<Props> {
	render() {
		return (
			<>
				<h2>
					<Trans>À quoi servent mes cotisations ?</Trans>
				</h2>
				<Distribution />

				{!(this.props.arePreviousAnswers && this.props.conversationStarted) && (
					<>
						<h2>
							<Trans>Simulation personnalisée</Trans>
						</h2>
						<p>
							<Trans i18nKey="custom-simulation">
								Il s'agit pour l'instant d'une
								<strong> première estimation</strong> sur la base d'un contrat
								générique. La législation française prévoit une multitude de cas
								particuliers et de règles spécifiques qui modifient
								considérablement les montants de l'embauche.
							</Trans>
						</p>
						<p style={{ textAlign: 'center' }}>
							<button
								className="ui__ button"
								onClick={this.props.startConversation}>
								<Trans>Faire une simulation personnalisée</Trans>
							</button>
						</p>
					</>
				)}
				<h2>
					<Trans>
						{this.props.period === 'mois'
							? 'Fiche de paie mensuelle'
							: 'Détail annuel des cotisations'}
					</Trans>
				</h2>
				<PaySlip />
			</>
		)
	}
}
