/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from 'next'
import handler from './claimTrialUser'

describe('claimTrialUser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockRequest.body = {}
    mockResponse.status.mockReturnValue(mockResponseStatus)
  })

  it('is unauthorized without signed-in user', async () => {
    mockGetAuthUser.mockReturnValue([false, false])
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for signed-in user without claimIdToken', async () => {
    mockGetAuthUser.mockReturnValue([{}, {}])
    mockRequest.body = {}
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for signed-in user without isTrial = true', async () => {
    mockGetAuthUser.mockReturnValue([{ isTrial: false }, {}])
    mockRequest.body = { claimIdToken: "1234" }
    await callHandler()
    expectUnauthorized()
  })

  it('is authorized for signed-in trial user with claimIdToken', async () => {
    const claimIdToken = '8675309'
    const user: Partial<ApiUser> = { id: 'trial-8675309', isTrial: true }
    const claimedUser: Partial<ApiUser> = { id: claimIdToken, isTrial: false }

    mockGetAuthUser.mockReturnValue([user, {}])
    mockRequest.body = { claimIdToken }
    mockClaimTrialUser.mockImplementation(async () => {
      return claimedUser
    })

    await callHandler()

    expect(mockClaimTrialUser).toBeCalledWith({ user, claimIdToken })

    expect(mockResponse.status).toBeCalledWith(200)
    expect(mockResponseStatus.json).toBeCalled()

    const [[resultJson]] = mockResponseStatus.json.mock.calls
    expect(resultJson.success).toBeTruthy()
    expect(resultJson.payload).toEqual(claimedUser)

    expect(mockLoginSessionForUser).toBeCalledWith(
      mockRequest,
      mockResponse,
      claimedUser
    )
  })
})

const callHandler = async () =>
  await handler(
    // HACK: there's probably a better way to handle these types
    mockRequest as unknown as NextApiRequest,
    mockResponse as unknown as NextApiResponse
  )

function expectUnauthorized() {
  expect(mockResponse.status).toBeCalledWith(401)
  expect(mockResponseStatus.json).toBeCalled()
  const resultJson = mockResponseStatus.json.mock.calls[0][0]
  expect(resultJson.success).toBeFalsy()
  expect(resultJson.errorId).toEqual('ERR_UNAUTHORIZED')
}

const mockRequest = { body: {} }
const mockResponse = { status: jest.fn() }
const mockResponseStatus = { json: jest.fn() }

const mockGetAuthUser = jest.fn()
const mockClaimTrialUser = jest.fn()
const mockLoginSessionForUser = jest.fn()

jest.mock('../../lib/serverAuth', () => {
  return {
    get getAuthUser() {
      return mockGetAuthUser
    },
    get claimTrialUser() {
      return mockClaimTrialUser
    },
    get loginSessionForUser() {
      return mockLoginSessionForUser
    },
  }
})
