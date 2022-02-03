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

export default function createStatementData(
  invoice: Invoice,
  plays: Plays
): StatementData {
  const enrichPerformances = invoice.performances.map(enrichPerformance);

  const result = {
    customer: invoice.customer,
    performances: enrichPerformances,
    totalAmount: totalAmount(enrichPerformances),
    totalVolumeCredits: totalVolumeCredits(enrichPerformances),
  };

  return result;

  function enrichPerformance(performance: Performance): EnrichPerformance {
    const calculator = createPerformanceCalculator(
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

  function totalAmount(enrichPerformances: EnrichPerformance[]): number {
    return enrichPerformances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(enrichPerformances: EnrichPerformance[]): number {
    return enrichPerformances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

function createPerformanceCalculator(
  performance: Performance,
  play: Play
): PerformanceCalculator {
  switch (play.type) {
    case "tragedy":
      return new TragedyCalculator(performance, play);
    case "comedy":
      return new ComedyCalculator(performance, play);
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }
}

abstract class PerformanceCalculator {
  constructor(
    public readonly performance: Performance,
    public readonly play: Play
  ) {}

  abstract get amount(): number;

  get volumeCredits(): number {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;

    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;

    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }

    result += 300 * this.performance.audience;

    return result;
  }

  get volumeCredits(): number {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}
