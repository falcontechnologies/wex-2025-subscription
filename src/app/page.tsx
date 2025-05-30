import { prisma } from '@/lib/prisma';
import {Subscription} from "@/generated/prisma";

const Home = async () => {
  const subscriptions = await prisma.subscription.findMany();

  return (
      <div className="p-4 flex flex-col gap-y-4">
        <h2>Subscriptions</h2>

        <ul className="flex flex-col gap-y-2"></ul>
        {subscriptions.map((subscription : Subscription) => (
            <li key={subscription.id}>{subscription.name}, | {subscription.provider} | {subscription.expiry_date.toDateString()}</li>
        ))}
      </div>
  );
};

export default Home;
