import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div className="p-6">Please log in to see your subscriptions.</div>;
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: parseInt(session.user.id) }
  });

  return (
    <div className="p-4">
      <h2>Your Subscriptions</h2>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id}>
            {sub.name} | {sub.provider} | {new Date(sub.expiry_date).toDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}