jest.mock('../../knex', () => {
  return (tableName: string) => {
    console.log('TABLE', tableName)
  }
})

const mockGetAuthUser = jest.fn()
const mockCreateTrialUser = jest.fn()
jest.mock('../../lib/serverAuth', () => {
  return {
    get getAuthUser() {
      return mockGetAuthUser
    },
    get createTrialUser() {
      return mockCreateTrialUser
    },
    get signupCodes() {
      return {
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
    },
  }
})

import { NextApiRequest, NextApiResponse } from 'next'
import handler from './createProfile'

describe('createProfile', () => {
  const mockRequest = { body: {} }
  const mockResponse = { status: jest.fn() }
  const mockResponseStatus = { json: jest.fn() }

  beforeEach(() => {
    jest.resetAllMocks()
    mockRequest.body = {}
    mockResponse.status.mockReturnValue(mockResponseStatus)
  })

  const callHandler = async () =>
    await handler(
      mockRequest as unknown as NextApiRequest,
      mockResponse as unknown as NextApiResponse
    )

  function expectUnauthorized() {
    expect(mockResponse.status).toBeCalledWith(401)
    expect(mockResponseStatus.json).toBeCalled()
    const resultJson = mockResponseStatus.json.mock.calls[0][0]
    expect(resultJson.success).toBeFalsy()
  }

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
    await callHandler()
    expectUnauthorized()
  })

  it('is unauthorized for anonymous user without valid active signup code', async () => {
    mockGetAuthUser.mockReturnValue([false, false])
    mockRequest.body = { signupCode: '8675309' }
    await callHandler()
    expectUnauthorized()
  })

  it('is authorized for anonymous user with valid signup code', async () => {
    const signupCode = '1234'
    const newUser = {}

    mockGetAuthUser.mockReturnValue([false, false])
    mockRequest.body = { signupCode }
    mockCreateTrialUser.mockImplementation(async () => {
      return [newUser, false]
    })

    await callHandler()

    expect(mockCreateTrialUser).toBeCalledWith({ signupCode })

    expect(mockResponse.status).toBeCalledWith(201)
    expect(mockResponseStatus.json).toBeCalled()
    const resultJson = mockResponseStatus.json.mock.calls[0][0]
    expect(resultJson.success).toBeTruthy()
    expect(resultJson.payload).toEqual(newUser)
  })
})
