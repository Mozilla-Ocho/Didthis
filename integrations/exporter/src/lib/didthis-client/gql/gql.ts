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
    "\n  mutation UpdateUserExportStatus($id: String!, $status: ExportStatusInput!) {\n    updateUserExportStatus(id: $id, status: $status) {\n      state\n      startedAt\n      finishedAt\n      expiresAt\n      error\n      url\n    }\n  }\n": types.UpdateUserExportStatusDocument,
    "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      profile {\n        exportStatus {\n          state\n          startedAt\n          finishedAt\n          expiresAt\n          jobId\n          error\n          url\n        }\n        name\n        bio\n        imageAssetId\n        imageSrc\n        imageMeta {\n          width\n          height\n        }\n        connectedAccounts {\n          discord {\n            username\n          }\n        }\n        socialUrls {\n          twitter\n          reddit\n          facebook\n          instagram\n          customSocial {\n            name\n            url\n          }\n        }\n        updatedAt\n        projects {\n          id\n          title\n          description\n          currentStatus\n          scope\n          imageAssetId\n          imageSrc\n          imageMeta {\n            width\n            height\n          }\n          updatedAt\n          updates {\n            id\n            type\n            scope\n            url\n            createdAt\n            didThisAt\n            updatedAt\n            description\n            imageSrc\n            imageAssetId\n            imageMeta {\n              width\n              height\n            }\n            linkUrl\n            linkMeta {\n              title\n              host\n              imageUrl\n              imageMeta {\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetUserDocument,
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
export function graphql(source: "\n  mutation UpdateUserExportStatus($id: String!, $status: ExportStatusInput!) {\n    updateUserExportStatus(id: $id, status: $status) {\n      state\n      startedAt\n      finishedAt\n      expiresAt\n      error\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserExportStatus($id: String!, $status: ExportStatusInput!) {\n    updateUserExportStatus(id: $id, status: $status) {\n      state\n      startedAt\n      finishedAt\n      expiresAt\n      error\n      url\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      profile {\n        exportStatus {\n          state\n          startedAt\n          finishedAt\n          expiresAt\n          jobId\n          error\n          url\n        }\n        name\n        bio\n        imageAssetId\n        imageSrc\n        imageMeta {\n          width\n          height\n        }\n        connectedAccounts {\n          discord {\n            username\n          }\n        }\n        socialUrls {\n          twitter\n          reddit\n          facebook\n          instagram\n          customSocial {\n            name\n            url\n          }\n        }\n        updatedAt\n        projects {\n          id\n          title\n          description\n          currentStatus\n          scope\n          imageAssetId\n          imageSrc\n          imageMeta {\n            width\n            height\n          }\n          updatedAt\n          updates {\n            id\n            type\n            scope\n            url\n            createdAt\n            didThisAt\n            updatedAt\n            description\n            imageSrc\n            imageAssetId\n            imageMeta {\n              width\n              height\n            }\n            linkUrl\n            linkMeta {\n              title\n              host\n              imageUrl\n              imageMeta {\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: String!) {\n    user(id: $id) {\n      id\n      profile {\n        exportStatus {\n          state\n          startedAt\n          finishedAt\n          expiresAt\n          jobId\n          error\n          url\n        }\n        name\n        bio\n        imageAssetId\n        imageSrc\n        imageMeta {\n          width\n          height\n        }\n        connectedAccounts {\n          discord {\n            username\n          }\n        }\n        socialUrls {\n          twitter\n          reddit\n          facebook\n          instagram\n          customSocial {\n            name\n            url\n          }\n        }\n        updatedAt\n        projects {\n          id\n          title\n          description\n          currentStatus\n          scope\n          imageAssetId\n          imageSrc\n          imageMeta {\n            width\n            height\n          }\n          updatedAt\n          updates {\n            id\n            type\n            scope\n            url\n            createdAt\n            didThisAt\n            updatedAt\n            description\n            imageSrc\n            imageAssetId\n            imageMeta {\n              width\n              height\n            }\n            linkUrl\n            linkMeta {\n              title\n              host\n              imageUrl\n              imageMeta {\n                width\n                height\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;