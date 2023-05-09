import knex from "@/knex";

export default function Home({ dbResult }: { dbResult: string }) {
  console.log("homepage render")
  return (
    <main className="p-10">
      <div>
        <h1>h3y</h1>
        <p>psst it stands for hobby</p>
        <p>database query result: {dbResult}</p>
      </div>
      <form action='/api/upload' encType='multipart/form-data' method="post">
        <input id='files' type="file" name="thefile" accept="image/*, video/*" />
        <input type="hidden" name="wut" value="wuuuut" />
        <button type='submit'>Upload</button>
      </form>
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
