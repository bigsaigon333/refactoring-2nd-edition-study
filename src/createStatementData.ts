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
    const calculator = new PerformanceCalculator(
      performance,
      playFor(performance)
    );
    const result = {
      ...performance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    };

    return result;
  }

  function playFor(performance: Performance): Play {
    return plays[performance.playID];
  }

  function totalAmount(data: Pick<StatementData, "performances">): number {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(
    data: Pick<StatementData, "performances">
  ): number {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

class PerformanceCalculator {
  readonly performance: Performance;
  readonly play: Play;

  constructor(performance: Performance, play: Play) {
    this.performance = performance;
    this.play = play;
  }

  get amount(): number {
    let result = 0;

    switch (this.play.type) {
      case "tragedy":
        result = 40000;

        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }

        break;
      case "comedy":
        result = 30000;

        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }

        result += 300 * this.performance.audience;
        break;

      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`알 수 없는 장르: ${this.play.type}`);
    }

    return result;
  }

  get volumeCredits(): number {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if (this.play.type === "comedy") {
      result += Math.floor(this.performance.audience / 5);
    }

    return result;
  }
}
