import { styled } from 'styled-components'

import { Emoji } from '@/design-system/emoji'

export type FeedbackT = 'mauvais' | 'moyen' | 'bien' | 'très bien'

const FeedbackRating = ({
	submitFeedback,
}: {
	submitFeedback: (feedbackValue: FeedbackT) => void
}) => {
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
			}}
			role="list"
		>
			<div role="listitem">
				<EmojiButton onClick={() => submitFeedback('mauvais')}>
					<Emoji
						emoji="🙁"
						aria-label="Pas satisfait, envoyer cette réponse"
						aria-hidden={false}
					/>
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton onClick={() => submitFeedback('moyen')}>
					<Emoji
						emoji="😐"
						aria-label="Moyennement satisfait, envoyer cette réponse"
						aria-hidden={false}
					/>
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton onClick={() => submitFeedback('bien')}>
					<Emoji
						emoji="🙂"
						aria-label="Plutôt satisfait, envoyer cette réponse"
						aria-hidden={false}
					/>
				</EmojiButton>
			</div>
			<div role="listitem">
				<EmojiButton onClick={() => submitFeedback('très bien')}>
					<Emoji
						emoji="😀"
						aria-label="Très satisfait, envoyer cette réponse"
						aria-hidden={false}
					/>
				</EmojiButton>
			</div>
		</div>
	)
}

const EmojiButton = styled.button`
	font-size: 1.5rem;
	padding: 0.6rem;
	border: none;
	background: none;
	transition: transform 0.05s;
	will-change: transform;
	:hover {
		transform: scale(1.3);
	}
`

export default FeedbackRating
