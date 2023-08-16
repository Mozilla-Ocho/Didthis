/**
 * @jest-environment node
 */
import { signupCodes, createTrialUser } from './serverAuth'

describe('createTrialUser', () => {
  it('works', async () => {
    const { value: signupCode, name: signupCodeName } =
      Object.values(signupCodes)[0]

    let insertedColumns: UserDbRowForWrite | undefined
    let expectedDbRow: UserDbRow | undefined
    mockKnexInsert.mockImplementation((columns: UserDbRowForWrite) => {
      insertedColumns = columns
      return { returning: mockKnexInsertReturning }
    })
    mockKnexInsertReturning.mockImplementation(() => {
      // HACK: this is ugly & inaccurate, but good enough for this test.
      expectedDbRow = {
        ...insertedColumns,
        trial_status: true,
      } as unknown as UserDbRow
      return [expectedDbRow]
    })

    const result = await createTrialUser({ signupCode })
    expect(result).toHaveLength(2)

    let [resultUser, resultDbRow] = result
    expect(resultUser).not.toBeFalsy()
    expect(resultDbRow).not.toBeFalsy()
    expect(insertedColumns).toBeDefined()

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
