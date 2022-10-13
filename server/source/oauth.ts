import got from 'got'

export interface OAuthResponse {
	access_token: string
	token_type: string
	expires_in: number
	scope: string
	refresh_token: string
	id_token: string
}

interface OAuthParams {
	serverUrl: string
	clientSecret: string
	clientId: string
	redirectUri: string
}

interface GetOAuthParams extends OAuthParams {
	code: string
}

export const getAccessToken = ({
	serverUrl,
	clientSecret,
	clientId,
	redirectUri,
	code,
}: GetOAuthParams) =>
	got.post<OAuthResponse>(`${serverUrl}/oauth/access_token`, {
		form: {
			client_secret: clientSecret,
			client_id: clientId,
			redirect_uri: redirectUri,
			grant_type: 'authorization_code',
			code,
		},
		responseType: 'json',
		throwHttpErrors: true,
	})

interface RefreshOAuthParams extends OAuthParams {
	serverUrl: string
	clientSecret: string
	clientId: string
	redirectUri: string
	refreshToken: string
}

export const refreshAccessToken = ({
	serverUrl,
	clientSecret,
	clientId,
	redirectUri,
	refreshToken,
}: RefreshOAuthParams) =>
	got.post<OAuthResponse>(`${serverUrl}/oauth/access_token`, {
		form: {
			client_secret: clientSecret,
			client_id: clientId,
			redirect_uri: redirectUri,
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		},
		responseType: 'json',
		throwHttpErrors: true,
	})
