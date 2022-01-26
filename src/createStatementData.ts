export interface Performance {
  playID: string;
  audience: number;
}

export interface EnrichPerformance extends Performance {
  play: Play;
  amount: number;
  volumeCredits: number;
}
export interface Play {
  name: string;
  type: "tragedy" | "comedy";
}

export type Plays = Record<string, Play>;

export interface Invoice {
  customer: string;
  performances: Performance[];
}

export interface StatementData extends Invoice {
  performances: EnrichPerformance[];
  totalAmount: number;
  totalVolumeCredits: number;
}

export default function createStatementData(invoice: Invoice, plays: Plays) {
  const data = {
    customer: invoice.customer,
    performances: invoice.performances.map(enrichPerformance),
  };

  const statementData: StatementData = {
    ...data,
    totalAmount: totalAmount(data),
    totalVolumeCredits: totalVolumeCredits(data),
  };

  return statementData;

  function enrichPerformance(performance: Performance): EnrichPerformance {
    const result = { ...performance };
    const resultWithPlay = Object.assign(result, {
      play: playFor(result),
    });
    const resultWithAmount = Object.assign(resultWithPlay, {
      amount: amountFor(resultWithPlay),
    });
    const resultWithVolumeCredits = Object.assign(resultWithAmount, {
      volumeCredits: volumeCreditsFor(resultWithAmount),
    });

    return resultWithVolumeCredits;
  }

  function playFor(performance: Performance) {
    return plays[performance.playID];
  }

  function amountFor(performance: Performance) {
    let result = 0;

    switch (playFor(performance).type) {
      case "tragedy":
        result = 40000;

        if (performance.audience > 30) {
          result += 1000 * (performance.audience - 30);
        }

        break;
      case "comedy":
        result = 30000;

        if (performance.audience > 20) {
          result += 10000 + 500 * (performance.audience - 20);
        }

        result += 300 * performance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${playFor(performance).type}`);
    }

    return result;
  }

  function volumeCreditsFor(performance: Performance & { play: Play }) {
    let result = 0;
    result += Math.max(performance.audience - 30, 0);
    if (performance.play.type === "comedy") {
      result += Math.floor(performance.audience / 5);
    }

    return result;
  }

  function totalAmount(data: Pick<StatementData, "performances">) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data: Pick<StatementData, "performances">) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}
