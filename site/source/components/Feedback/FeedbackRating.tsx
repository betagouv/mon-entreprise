import { styled } from 'styled-components'

import { Emoji, Li } from '@/design-system'

export type FeedbackT = 'mauvais' | 'moyen' | 'bien' | 'très bien'

const FeedbackRating = ({
	submitFeedback,
}: {
	submitFeedback: (feedbackValue: FeedbackT) => void
}) => {
	return (
		<EmojisList
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
			}}
		>
			<Li>
				<EmojiButton
					onClick={() => submitFeedback('mauvais')}
					aria-label="Pas satisfait, envoyer cette réponse"
				>
					<Emoji emoji="🙁" />
				</EmojiButton>
			</Li>
			<Li>
				<EmojiButton
					onClick={() => submitFeedback('moyen')}
					aria-label="Moyennement satisfait, envoyer cette réponse"
				>
					<Emoji emoji="😐" />
				</EmojiButton>
			</Li>
			<Li>
				<EmojiButton
					onClick={() => submitFeedback('bien')}
					aria-label="Plutôt satisfait, envoyer cette réponse"
				>
					<Emoji emoji="🙂" />
				</EmojiButton>
			</Li>
			<Li>
				<EmojiButton
					onClick={() => submitFeedback('très bien')}
					aria-label="Très satisfait, envoyer cette réponse"
				>
					<Emoji emoji="😀" />
				</EmojiButton>
			</Li>
		</EmojisList>
	)
}

const EmojisList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`

const EmojiButton = styled.button`
	font-size: 1.5rem;
	padding: 0.6rem;
	border: none;
	background: none;
	transition: transform 0.05s;
	will-change: transform;
	&:hover {
		transform: scale(1.3);
	}
`

export default FeedbackRating
