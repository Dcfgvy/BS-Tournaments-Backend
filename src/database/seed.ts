import { DataSource, DataSourceOptions } from "typeorm";
import { dataSourceOptions } from "./data-source";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { UserFactory } from "./factories/user.factory";
import UserSeeder from "./seeders/user.seeder";
import BrawlerSeeder from "./seeders/brawler.seeder";
import PaymentMethodSeeder from "./seeders/payment-method.seeder";
import WithdrawalMethodSeeder from "./seeders/withdrawal-method.seeder";
import EventAndMapSeeder from "./seeders/event-and-map.seeder";

// Map of database tables names to seeder classes
const allSeeders = {
  'users': UserSeeder,
  'brawlers': BrawlerSeeder,
  'payment_methods': PaymentMethodSeeder,
  'withdrawal_methods': WithdrawalMethodSeeder,
  'events': EventAndMapSeeder,
};

// Extract command-line arguments to specify seeders
const specifiedSeeders = process.argv.slice(2); // Arguments after the script name

// Check for errors
const invalidSeeders = specifiedSeeders.filter((name) => !allSeeders[name]);
if (invalidSeeders.length > 0) {
  console.error(`Invalid seeders specified: ${invalidSeeders.join(", ")}`);
  process.exit(1);
}

// Filter seeders based on user input
const seedsToRun = specifiedSeeders.length
  ? specifiedSeeders.map((name) => allSeeders[name]).filter(Boolean)
  : Object.values(allSeeders); // Default to all seeders if none specified

const seedSourceOptions: DataSourceOptions & SeederOptions = {
  ...dataSourceOptions,
  factories: [UserFactory],
  seeds: seedsToRun,
};

const dataSource = new DataSource(seedSourceOptions);
dataSource.initialize().then(async () => {
  if (seedsToRun.length === 0) {
    console.log("No specific seeders specified, running all seeders...");
  } else {
    console.log(`Running specified seeders: ${specifiedSeeders.join(", ")}`);
  }

  await runSeeders(dataSource);
  process.exit();
});
