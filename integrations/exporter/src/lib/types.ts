import { Command } from 'commander'
import { Config } from './config'
import { Logger } from './logging'

import { DidthisClient } from './didthis-client/index'

export type CliContext = {
  program: Command
  config: Config
  log: Logger
}

export type FetchUserByIdResult = Awaited<
  ReturnType<DidthisClient['fetchUserById']>
>
export type User = NonNullable<FetchUserByIdResult>
export type Profile = NonNullable<User['profile']>
export type Project = NonNullable<NonNullable<Profile['projects']>[number]>
export type Update = NonNullable<NonNullable<Project['updates']>[number]>

export type ImageMetadata = {
  format: string
  version: number
  resource_type: string
  type: string
  created_at: string
  bytes: number
  width: number
  height: number
  path: string
}
