import knex from "@/knex";
import { H, Button, Divider } from "@/components/uiLib";

export default function Home({ dbResult }: { dbResult: string }) {
  console.log("homepage render");
  return (
    <main className="p-10">
      <div>
        <H.H1>h3y</H.H1>
        <p>
          <em>psst... it stands for hobby</em>
        </p>
        <pre>database query result: {dbResult}</pre>
      </div>
      <Divider />
      <H.H2>vanilla html upload tester</H.H2>
      <form action="/api/upload" encType="multipart/form-data" method="post">
        <input
          id="files"
          type="file"
          name="thefile"
          accept="image/*, video/*"
        />
        <Button type="submit">Upload</Button>
      </form>
      <Divider />
      <H.H3>heading 3</H.H3>
      <H.H4>heading 4</H.H4>
    </main>
  );
}

export async function getServerSideProps() {
  let dbResult;
  if (process.env.FLAG_USE_DB === "true") {
    try {
      dbResult = await knex("dummy_records").first();
      dbResult = dbResult ? JSON.stringify(dbResult) : "no rows found";
    } catch (e: unknown) {
      dbResult = `db error: ${String(e)}`;
    }
  } else {
    dbResult = "FLAG_USE_DB is false";
  }
  return { props: { dbResult } };
}
