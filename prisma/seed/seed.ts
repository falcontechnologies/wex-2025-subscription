import { PrismaClient } from "../../src/generated/prisma/client";
import {Payment} from "@/generated/prisma";
import {Subscription} from "@/generated/prisma";
import {Event} from "@/generated/prisma";

const prisma = new PrismaClient();

const Payments = require( './data/payments' );
const Subscriptions = require('./data/subscriptions');
const Events = require('./data/events');

async function runSeeders() {
    // Payments
    await Promise.all(
        Payments.map(async (payment: Payment)=>
            prisma.payment.upsert({
                where: { id: payment.id},
                update: {},
                create: payment,
            })
        )
    );
    // Subscriptions
    await Promise.all(
        Subscriptions.map(async (subscription: Subscription)=>
            prisma.subscription.upsert({
                where: { id: subscription.id},
                update: {},
                create: subscription,
            })
        )
    );
    // Events
    await Promise.all(
        Events.map(async (event: Event)=>
            prisma.event.upsert({
                where: { event_id: event.event_id},
                update: {},
                create: event,
            })
        )
    );
}

runSeeders()
    .catch((e) => {
        console.error(`There was an error while seeding: ${e}`);
        process.exit(1);
    })
    .finally(async () => {
        console.log('Successfully seeded database. Closing connection.');
        await prisma.$disconnect();
    });