import Router from '@koa/router'
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa'

export type KoaContext = ParameterizedContext<
	DefaultState,
	DefaultContext & Router.RouterParamContext<DefaultState, DefaultContext>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	any
>
