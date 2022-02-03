import createStatementData from "./createStatementData";
import type { Invoice, Plays, StatementData } from "./createStatementData";

export default function statement(invoice: Invoice, plays: Plays): string {
  const statementData = createStatementData(invoice, plays);

  return renderPlainText(statementData);
}

function renderPlainText(data: StatementData): string {
  let result = `청구내역 (고객명: ${data.customer})\n`;

  for (const perf of data.performances) {
    result += `  ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액 ${usd(data.totalAmount)}\n`;
  result += `적립 포인트 ${data.totalVolumeCredits}점\n`;

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function htmlStatement(invoice: Invoice, plays: Plays): string {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data: StatementData): string {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th><tr>";

  for (const perf of data.performances) {
    result += `  <tr><td>${perf.play.name}</td><td>${usd(perf.amount)}</td>`;
    result += `<td>${perf.audience}석</td></tr>\n`;
  }

  result += "</table>\n";
  result += `<p>총액 <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트 <em>${data.totalVolumeCredits}</em>점\n`;

  return result;
}

function usd(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num / 100);
}
