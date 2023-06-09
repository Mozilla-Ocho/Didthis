exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('dummy_records')
    .del()
    .then(() =>
      // Inserts seed entries
      knex('dummy_records').insert([
        { id: 1, value: 'rowValue1' },
        { id: 2, value: 'rowValue2' },
        { id: 3, value: 'rowValue3' },
      ])
    )
}
