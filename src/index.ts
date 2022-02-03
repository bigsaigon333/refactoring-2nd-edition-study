import statement from "./statement";

import invoices from "./invoices.json";
import plays from "./plays.json";

import type { Plays } from "./createStatementData";

for (const invoice of invoices) {
  console.log(statement(invoice, plays as Plays));
}
