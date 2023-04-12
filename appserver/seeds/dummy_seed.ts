import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("dummy_records").del();

  // Inserts seed entries
  await knex("dummy_records").insert([
    { id: 1, value: "rowValue1" },
    { id: 2, value: "rowValue2" },
    { id: 3, value: "rowValue3" },
  ]);
}
