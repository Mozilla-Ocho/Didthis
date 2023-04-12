import knex from "@/knex";

export default function Home({ dbResult }: { dbResult: string }) {
  return (
    <main className="p-10">
      <div>
        <p>Appserver hello world from Next.js</p>
        <p>database query result: {dbResult}</p>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  let dbResult;
  if (process.env.FLAG_USE_DB === "true") {
    try {
      dbResult = await knex('dummy_records').first();
      dbResult = dbResult ? JSON.stringify(dbResult) : 'no rows found';
    } catch (e: unknown) {
      dbResult = `db error: ${String(e)}`;
    }
  } else {
    dbResult = "FLAG_USE_DB is false";
  }
  return { props: { dbResult } };
}
