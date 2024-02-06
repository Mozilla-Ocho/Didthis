/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetPublicUpdates(\n    $since: DateTime!\n    $until: DateTime!\n    $requireDiscordAccount: Boolean\n    $requireAutoShare: Boolean\n  ) {\n    publicUpdates(\n      since: $since\n      until: $until\n      requireDiscordAccount: $requireDiscordAccount\n      requireAutoShare: $requireAutoShare\n    ) {\n      ...UpdateFragment\n    }\n  }\n": types.GetPublicUpdatesDocument,
    "\n  fragment UpdateFragment on Update {\n    id\n    type\n    url\n    user {\n      url\n      slug\n      profile {\n        name\n        bio\n        connectedAccounts {\n          discord {\n            id\n            username\n            globalName\n          }\n        }\n      }\n    }\n    project {\n      url\n      title\n    }\n    didThisAt\n    updatedAt\n    description\n    imageMeta {\n      width\n      height\n    }\n    imageSrc\n    linkUrl\n    linkMeta {\n      title\n      host\n      imageUrl\n      imageMeta {\n        width\n        height\n      }\n    }\n  }\n": types.UpdateFragmentFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPublicUpdates(\n    $since: DateTime!\n    $until: DateTime!\n    $requireDiscordAccount: Boolean\n    $requireAutoShare: Boolean\n  ) {\n    publicUpdates(\n      since: $since\n      until: $until\n      requireDiscordAccount: $requireDiscordAccount\n      requireAutoShare: $requireAutoShare\n    ) {\n      ...UpdateFragment\n    }\n  }\n"): (typeof documents)["\n  query GetPublicUpdates(\n    $since: DateTime!\n    $until: DateTime!\n    $requireDiscordAccount: Boolean\n    $requireAutoShare: Boolean\n  ) {\n    publicUpdates(\n      since: $since\n      until: $until\n      requireDiscordAccount: $requireDiscordAccount\n      requireAutoShare: $requireAutoShare\n    ) {\n      ...UpdateFragment\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UpdateFragment on Update {\n    id\n    type\n    url\n    user {\n      url\n      slug\n      profile {\n        name\n        bio\n        connectedAccounts {\n          discord {\n            id\n            username\n            globalName\n          }\n        }\n      }\n    }\n    project {\n      url\n      title\n    }\n    didThisAt\n    updatedAt\n    description\n    imageMeta {\n      width\n      height\n    }\n    imageSrc\n    linkUrl\n    linkMeta {\n      title\n      host\n      imageUrl\n      imageMeta {\n        width\n        height\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment UpdateFragment on Update {\n    id\n    type\n    url\n    user {\n      url\n      slug\n      profile {\n        name\n        bio\n        connectedAccounts {\n          discord {\n            id\n            username\n            globalName\n          }\n        }\n      }\n    }\n    project {\n      url\n      title\n    }\n    didThisAt\n    updatedAt\n    description\n    imageMeta {\n      width\n      height\n    }\n    imageSrc\n    linkUrl\n    linkMeta {\n      title\n      host\n      imageUrl\n      imageMeta {\n        width\n        height\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;