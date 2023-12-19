import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { Config } from '../config'
import { Logger } from '../logging'
import { graphql, FragmentType, useFragment } from './gql'
import { GetPublicUpdatesQueryVariables } from './gql/graphql'

export type ClientContext = {
  config: Config
  log: Logger
}

export default async function initClient(context: ClientContext) {
  const { config } = context

  const url = config.get('didthisApiUrl')
  const accessToken = config.get('didthisApiToken')

  return new DidthisClient(url, accessToken)
}

export class DidthisClientError extends Error {}

export class DidthisClient {
  client: Client

  constructor(url: string, accessToken: string) {
    this.client = new Client({
      url: url,
      exchanges: [cacheExchange, fetchExchange],
      fetchOptions: () => ({
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    })
  }

  async fetchPublicUpdates(vars: GetPublicUpdatesQueryVariables) {
    const result = await this.client.query(GetPublicUpdates, vars)
    if (result.error) {
      throw new DidthisClientError(result.error.toString())
    }
    const updates = result.data?.publicUpdates || []
    return updates.map(update => useFragment(UpdateFragment, update))
  }
}

export const GetPublicUpdates = graphql(/* GraphQL */ `
  query GetPublicUpdates(
    $since: DateTime!
    $until: DateTime!
    $requireDiscordAccount: Boolean
    $requireAutoShare: Boolean
  ) {
    publicUpdates(
      since: $since
      until: $until
      requireDiscordAccount: $requireDiscordAccount
      requireAutoShare: $requireAutoShare
    ) {
      ...UpdateFragment
    }
  }
`)

export const UpdateFragment = graphql(/* GraphQL */ `
  fragment UpdateFragment on Update {
    id
    type
    url
    user {
      url
      slug
      profile {
        name
        bio
        connectedAccounts {
          discord {
            id
            username
            globalName
          }
        }
      }
    }
    project {
      url
      title
    }
    didThisAt
    updatedAt
    description
    imageMeta {
      width
      height
    }
    imageSrc
    linkUrl
    linkMeta {
      title
      host
      imageUrl
      imageMeta {
        width
        height
      }
    }
  }
`)
