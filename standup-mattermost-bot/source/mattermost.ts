import got from 'got'

interface MattermostInput {
	serverUrl: string
	accessToken: string
}

interface MattermostGetUser extends MattermostInput {
	userId: string
}

interface MattermostUser {
	id: string
	create_at: number
	update_at: number
	delete_at: number
	username: string
	email: string
	email_verified: boolean
	nickname: string
	first_name: string
	last_name: string
	roles: string
}

export const getUser = ({
	serverUrl,
	accessToken,
	userId,
}: MattermostGetUser) =>
	got.get<MattermostUser>(`${serverUrl}/api/v4/users/${userId}`, {
		responseType: 'json',
		headers: { Authorization: `Bearer ${accessToken}` },
	})

interface MattermostGetUserChannels extends MattermostInput {
	userId: string
}

interface MattermostChannel {
	id: string
	create_at: number
	update_at: number
	delete_at: number
	team_id: string
	type: string
	display_name: string
	name: string
	header: string
	purpose: string
	last_post_at: number
	total_msg_count: number
	extra_update_at: number
	creator_id: string
	total_msg_count_root: number
	last_root_post_at: number
}

export const getUserChannels = ({
	serverUrl,
	accessToken,
	userId,
}: MattermostGetUserChannels) =>
	got.get<MattermostChannel[]>(`${serverUrl}/api/v4/users/${userId}/channels`, {
		responseType: 'json',
		headers: { Authorization: `Bearer ${accessToken}` },
	})

interface MattermostGetChannelMembers extends MattermostInput {
	channelId: string
}

interface MattermostChannelMember {
	channel_id: string
	user_id: string
	roles: string
	last_viewed_at: number
	msg_count: number
	mention_count: number
	mention_count_root: number
	msg_count_root: number
	notify_props: unknown
	last_update_at: number
	scheme_guest: false
	scheme_user: boolean
	scheme_admin: boolean
	explicit_roles: string
}

export const getChannelMembers = ({
	serverUrl,
	accessToken,
	channelId,
}: MattermostGetChannelMembers) =>
	got.get<MattermostChannelMember[]>(
		`${serverUrl}/api/v4/channels/${channelId}/members`,
		{
			responseType: 'json',
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	)

interface MattermostPost {
	id: string
	create_at: number
	update_at: number
	delete_at: number
	is_pinned: false
	user_id: string
	channel_id: string
	root_id: string
	original_id: string
	message: string
	type: string
	props: unknown
	hashtags: string
	pending_post_id: string
	reply_count: number
	last_reply_at: number
	metadata: unknown
}

/* get posts from a channel

interface MattermostGetChannelPosts extends MattermostInput {
	channelId: string
}

interface MattermostChannelPost {
	order: string[]
	posts: { [id: string]: MattermostPost }
	next_post_id: string
	prev_post_id: string
}

export const getChannelPosts = ({
	serverUrl,
	accessToken,
	channelId,
}: MattermostGetChannelPosts) =>
	got.get<MattermostChannelPost>(
		`${serverUrl}/api/v4/channels/${channelId}/posts`,
		{
			responseType: 'json',
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	)

*/

export interface MattermostSendMessage extends MattermostInput {
	channelId: string
	message: string
	props?: {
		from_webhook?: 'true'
		override_icon_url?: string
		override_username?: string
	}
	rootId?: string
}

export const sendMessage = ({
	serverUrl,
	accessToken,
	channelId,
	message,
	props,
	rootId,
}: MattermostSendMessage) =>
	got.post<MattermostPost>(`${serverUrl}/api/v4/posts`, {
		json: {
			channel_id: channelId,
			message,
			props,
			root_id: rootId,
		},
		responseType: 'json',
		headers: { Authorization: `Bearer ${accessToken}` },
	})
