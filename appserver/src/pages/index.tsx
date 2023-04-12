const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export default function Home({ dbResult }) {
  return (
    <main className="p-10">
      <div>
        <p>Appserver hello world from Next.js</p>
        <p>database query result: {JSON.stringify(dbResult)}</p>
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  let dbResult;
  if (process.env.FLAG_USE_DB === "true") {
    try {
      dbResult = await prisma.DummyRecord.findMany();
    } catch (e) {
      dbResult = { error_message: e.message };
    }
  } else {
    dbResult = "FLAG_USE_DB is false";
  }
  return { props: { dbResult } };
}
