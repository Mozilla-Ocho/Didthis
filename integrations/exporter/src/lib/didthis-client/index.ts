import { Client, cacheExchange, fetchExchange } from '@urql/core'
import { Config } from '../config'
import { Logger } from '../logging'
import { graphql } from './gql'
import {
  GetUserQueryVariables,
  ExportStatusState,
  ExportStatusInput,
} from './gql/graphql'

export type ClientContext = {
  config: Config
  log: Logger
}

export default async function initClient(context: ClientContext) {
  const { log, config } = context

  const url = config.get('didthisApiUrl')
  const accessToken = config.get('didthisApiToken')

  log.trace({ msg: 'Initializing Didthis client', url })

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

  async fetchUserById(vars: GetUserQueryVariables) {
    const result = await this.client.query(GetUserById, vars)
    if (result.error) {
      throw new DidthisClientError(result.error.toString())
    }
    return result?.data?.user
  }

  async updateUserExportStatus(id: string, status: ExportStatusInput) {
    const result = await this.client.mutation(UpdateUserExportStatus, {
      id,
      status,
    })
    if (result.error) {
      throw new DidthisClientError(result.error.toString())
    }
    return result.data
  }
}

export const UpdateUserExportStatus = graphql(/* GraphQL */ `
  mutation UpdateUserExportStatus($id: String!, $status: ExportStatusInput!) {
    updateUserExportStatus(id: $id, status: $status) {
      state
      startedAt
      finishedAt
      expiresAt
      error
      url
    }
  }
`)

export const GetUserById = graphql(/* GraphQL */ `
  query GetUser($id: String!) {
    user(id: $id) {
      id
      profile {
        exportStatus {
          state
          startedAt
          finishedAt
          expiresAt
          jobId
          error
          url
        }
        name
        bio
        imageAssetId
        imageSrc
        imageMeta {
          width
          height
        }
        connectedAccounts {
          discord {
            username
          }
        }
        socialUrls {
          twitter
          reddit
          facebook
          instagram
          customSocial {
            name
            url
          }
        }
        updatedAt
        projects {
          id
          title
          description
          currentStatus
          scope
          imageAssetId
          imageSrc
          imageMeta {
            width
            height
          }
          updatedAt
          updates {
            id
            type
            scope
            url
            createdAt
            didThisAt
            updatedAt
            description
            imageSrc
            imageAssetId
            imageMeta {
              width
              height
            }
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
        }
      }
    }
  }
`)
