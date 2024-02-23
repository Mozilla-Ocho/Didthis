/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from 'next'
import handler from './sessionLoginAsTrialUser'

describe('sessionLoginAsTrialUser', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockRequest.body = {}
    mockRequest.query = {}
    mockResponse.status.mockReturnValue(mockResponseStatus)
  })

  it('is unauthorized for a signed-in user', async () => {
    mockGetAuthUser.mockReturnValue([{}, {}])
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for anonymous user without signup code', async () => {
    mockGetAuthUser.mockReturnValue([false, false])
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for anonymous user without valid signup code', async () => {
    mockGetAuthUser.mockReturnValue([false, false])
    mockRequest.body = { signupCode: 'hahasorrybud' }
    mockRequest.query = {}
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for anonymous user without valid active signup code', async () => {
    mockGetAuthUser.mockReturnValue([false, false])
    mockRequest.body = { signupCode: '8675309' }
    mockRequest.query = {}
    await callHandler()
    expectUnauthorized()
  })

  it('is authorized for anonymous user with valid signup code', async () => {
    const signupCode = '1234'
    const newUser = { id: 'trial-8675309' }

    mockGetAuthUser.mockReturnValue([false, false])
    mockRequest.body = { signupCode }
    mockRequest.query = {}
    mockCreateTrialUser.mockImplementation(async () => {
      return [newUser, false]
    })

    await callHandler()

    expect(mockCreateTrialUser).toBeCalledWith({ signupCode })

    expect(mockResponse.status).toBeCalledWith(201)
    expect(mockResponseStatus.json).toBeCalled()

    const [[resultJson]] = mockResponseStatus.json.mock.calls
    expect(resultJson.success).toBeTruthy()
    expect(resultJson.payload).toEqual(newUser)

    expect(mockLoginSessionForUser).toBeCalledWith(
      mockRequest,
      mockResponse,
      newUser
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
}

const mockRequest = { body: {}, query: {} }
const mockResponse = { status: jest.fn() }
const mockResponseStatus = { json: jest.fn() }

const mockGetAuthUser = jest.fn()
const mockCreateTrialUser = jest.fn()
const mockLoginSessionForUser = jest.fn()
const mockSignupCodes = {
  '1234': {
    active: true,
    value: '1234',
    name: 'dev',
    envNames: ['dev'],
  },
  '8675309': {
    active: false,
    value: '1234',
    name: 'dev',
    envNames: ['dev'],
  },
}

jest.mock('../../lib/serverAuth', () => {
  return {
    get getAuthUser() {
      return mockGetAuthUser
    },
    get createTrialUser() {
      return mockCreateTrialUser
    },
    get loginSessionForUser() {
      return mockLoginSessionForUser
    },
    get signupCodes() {
      return mockSignupCodes
    },
  }
})
