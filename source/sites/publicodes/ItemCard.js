import { React, emoji } from 'Components'
import HumanCarbonImpact from './HumanCarbonImpact'

export default ({
	dottedName,
	formule,
	title,
	icônes,
	nodeValue,
	scenario,
	showHumanCarbon,
	showCarbon
}) => {
	return (
		<div
			key={dottedName}
			css={`
					font-size: 120%;
					padding: 1rem 0 0;
					margin: 0.6rem;
					width: 10rem;
					min-height: 7em;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: middle;
					text-align: center;
					flex-wrap: wrap;
					line-height: 1.2em;
					${formule != null ? '' : 'filter: grayscale(70%); opacity: 0.6;'}

					display: flex;
					align-items: center;
					flex-wrap: wrap;
				    background-color: var(--lightestColour);
					color: var(--darkColour);
					margin: 1rem 0;
					position: relative;
					border-radius: 0.3rem;
					text-decoration: none;
					box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
						0 1px 2px rgba(41, 117, 209, 0.24);
					transition: box-shadow 0.2s;

					:hover {
					    opacity: 1 !important;
						box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2), 0px 4px 5px 0px rgba(41, 117, 209, 0.14), 0px 1px 10px 0px rgba(41, 117, 209, 0.12);
}
				     ${
								showHumanCarbon
									? `
						width: 18rem
				     `
									: `

						padding: 1rem;
									 `
							}
					}

				`}>
			<div css="width: 100%; img { font-size: 150%}}">
				{icônes && emoji(icônes + ' ')}
			</div>
			<span css="width: 100%">{title}</span>
			{showHumanCarbon && (
				<>
					<div css="visibility: hidden">placeholder</div>
					<div
						css={`
							border-bottom-left-radius: 0.3rem;
							border-bottom-right-radius: 0.3rem;
							bottom: 0;
							left: 0;
							width: 100%;
							background: var(--colour);
							color: white;
							font-size: 80%;
						`}>
						<HumanCarbonImpact
							{...{ nodeValue, formule, dottedName, scenario, showCarbon }}
						/>
					</div>
				</>
			)}
		</div>
	)
}
