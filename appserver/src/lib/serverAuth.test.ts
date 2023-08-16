/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from 'next'
import {
  createTrialUser,
  loginSessionForUser,
  sessionCookieMaxAgeMillis,
  signupCodes,
} from './serverAuth'
import { sessionCookieName } from './/apiConstants'

describe('createTrialUser', () => {
  let oldEnvName: string | undefined
  beforeEach(() => {
    oldEnvName = process.env.NEXT_PUBLIC_ENV_NAME
    process.env.NEXT_PUBLIC_ENV_NAME = 'dev'
  })
  afterEach(() => {
    process.env.NEXT_PUBLIC_ENV_NAME = oldEnvName
  })

  it('creates a trial user for a valid signup code', async () => {
    const [{ value: signupCode, name: signupCodeName }] =
      Object.values(signupCodes)

    let insertedColumns: UserDbRowForWrite | undefined
    let expectedDbRow: UserDbRow | undefined
    mockKnexInsert.mockImplementation((columns: UserDbRowForWrite) => {
      insertedColumns = columns
      return { returning: mockKnexInsertReturning }
    })
    mockKnexInsertReturning.mockImplementation(() => {
      // HACK: this is ugly & inaccurate, but good enough for this test.
      expectedDbRow = insertedColumns as unknown as UserDbRow
      return [expectedDbRow]
    })

    const result = await createTrialUser({ signupCode })
    expect(result).toHaveLength(2)

    let [resultUser, resultDbRow] = result
    expect(resultUser).not.toBeFalsy()
    expect(resultDbRow).not.toBeFalsy()
    expect(insertedColumns).toBeDefined()
    expect(expectedDbRow).toBeDefined()

    // HACK: make typescript happier about these types asserted in expect()
    resultUser = resultUser as ApiUser
    resultDbRow = resultDbRow as UserDbRow
    insertedColumns = insertedColumns as UserDbRowForWrite

    expect(resultDbRow).toEqual(expectedDbRow)

    const resultSlug = insertedColumns.system_slug
    expect(resultUser.id).toEqual(`trial-${resultSlug}`)
    expect(resultUser.email).toBeNull()
    expect(resultUser.signupCodeName).toEqual(signupCodeName)
    expect(resultUser.isTrial).toBeTruthy()
  })
})

describe('loginSessionForUser', () => {
  let oldSecret: string | undefined
  beforeEach(() => {
    oldSecret = process.env.SESSION_COOKIE_SECRET
    process.env.SESSION_COOKIE_SECRET = 'trustno1'
  })
  afterEach(() => {
    process.env.SESSION_COOKIE_SECRET = oldSecret
  })

  it('sets a session cookie for the given user', async () => {
    const user = {
      id: 'trial-8675309',
    } as unknown as ApiUser

    await loginSessionForUser(
      // HACK: there's probably a better way to handle these types
      mockRequest as unknown as NextApiRequest,
      mockResponse as unknown as NextApiResponse,
      user
    )

    expect(mockCookiesSet).toBeCalled()

    const [[resultName, resultValue, resultOptions]] = mockCookiesSet.mock.calls
    expect(resultName).toEqual(sessionCookieName)
    expect(resultOptions.maxAge).toEqual(sessionCookieMaxAgeMillis)

    const [content, _sig] = resultValue.split(':')
    const [_version, uid, issued, revalidated] = content.split('|')
    expect(uid).toEqual(user.id)
    expect(issued).not.toEqual(0)
    expect(revalidated).toEqual(issued)
  })
})

const mockKnexQueryBuilder = jest.fn((tableName: string) => ({
  insert: mockKnexInsert,
  where: mockKnexWhere,
}))
const mockKnexInsert = jest.fn((columns: UserDbRowForWrite) => ({
  returning: mockKnexInsertReturning,
}))
const mockKnexInsertReturning = jest.fn(() => [] as UserDbRow[])
const mockKnexWhere = jest.fn(() => ({ orWhere: mockKnexOrWhere }))
const mockKnexOrWhere = jest.fn(() => ({ first: mockKnexFirst }))
const mockKnexFirst = jest.fn(() => Promise.resolve(undefined))

jest.mock('../knex', () => {
  return (tableName: string) => mockKnexQueryBuilder(tableName)
})

const mockRequest = { body: {} }
const mockResponse = { status: jest.fn(() => mockResponseStatus) }
const mockResponseStatus = { json: jest.fn() }

const mockCookiesGet = jest.fn()
const mockCookiesSet = jest.fn()
jest.mock('cookies', () => {
  class MockCookies {
    get(name: string, opts?: Record<string, unknown>) {
      return mockCookiesGet(name, opts)
    }
    set(name: string, value?: string | null, opts?: Record<string, unknown>) {
      mockCookiesSet(name, value, opts)
      return this
    }
  }
  return MockCookies
})
