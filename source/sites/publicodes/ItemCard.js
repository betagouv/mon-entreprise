import React from 'react'
import emoji from 'react-easy-emoji'
import HumanCarbonImpact from './HumanCarbonImpact'
import withTarget from './withTarget'

export default (withFigure) => {
	let decorator = withFigure ? withTarget : (a) => a
	return decorator(
		({
			dottedName,
			formule,
			title,
			icônes,
			nodeValue,
			scenario,
			nextSteps,
			foldedSteps,
		}) => (
			<div
				key={dottedName}
				css={`
					font-size: 120%;
					padding: ${withFigure ? '1rem 0 0' : '1rem'};
					width: ${withFigure ? '18rem' : '10rem'};
					min-height: 7em;
					${!withFigure &&
					`
					@media (max-width: 600px){
							padding: .6rem;
							width: 9rem;
							font-size: 110%;
							min-height: 6.5rem
					}
					`}
					position: relative;
					display: flex;
					align-items: center;
					justify-content: middle;
					text-align: center;
					flex-wrap: wrap;
					line-height: 1.2em;
					${formule != null ? '' : 'filter: grayscale(70%); opacity: 0.6;'}

					background-color: var(--lightestColor);
					color: var(--darkColor);
					margin: 1rem 0;
					border-radius: 0.3rem;
					box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
						0 1px 2px rgba(41, 117, 209, 0.24);
					transition: box-shadow 0.2s;

					:hover {
						opacity: 1 !important;
						box-shadow: 0px 2px 4px -1px rgba(41, 117, 209, 0.2),
							0px 4px 5px 0px rgba(41, 117, 209, 0.14),
							0px 1px 10px 0px rgba(41, 117, 209, 0.12);
					}
				`}
			>
				<div css="width: 100%; img { font-size: 150%}}">
					{icônes && emoji(icônes + ' ')}
				</div>
				<span css="width: 100%">{title}</span>
				{withFigure && (
					<>
						<div css="visibility: hidden">placeholder</div>
						<div
							css={`
								border-bottom-left-radius: 0.3rem;
								border-bottom-right-radius: 0.3rem;
								bottom: 0;
								left: 0;
								width: 100%;
								background: var(--color);
								color: white;
								font-size: 80%;
							`}
						>
							<HumanCarbonImpact
								{...{
									nodeValue,
									formule,
									dottedName,
									scenario,
									nextSteps,
									foldedSteps,
								}}
							/>
						</div>
					</>
				)}
			</div>
		)
	)
}
