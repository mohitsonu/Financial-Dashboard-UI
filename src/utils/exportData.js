/**
 * Export helpers for transactions data.
 * Supports CSV and JSON downloads — triggered from the Transactions page.
 */

// convert transactions array into a CSV string
function transactionsToCSV(transactions) {
  const headers = ['ID', 'Description', 'Type', 'Date', 'Amount (₹)', 'Status'];

  const rows = transactions.map(txn => [
    txn.id,
    // wrap description in quotes since it may contain commas
    `"${txn.fundName}"`,
    txn.type,
    txn.date,
    txn.amount,
    txn.status,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// trigger a browser download for any text content
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export the given transactions as a CSV file.
 * @param {Array} transactions — the filtered (or full) transaction list
 */
export function exportAsCSV(transactions) {
  const csv = transactionsToCSV(transactions);
  const date = new Date().toISOString().split('T')[0];
  downloadFile(csv, `transactions_${date}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export the given transactions as a JSON file.
 * @param {Array} transactions — the filtered (or full) transaction list
 */
export function exportAsJSON(transactions) {
  // only export business-relevant fields (strip any legacy nav/units from old data)
  const clean = transactions.map(({ id, fundName, type, date, amount, status }) => ({
    id, fundName, type, date, amount, status,
  }));
  const json = JSON.stringify(clean, null, 2);
  const date = new Date().toISOString().split('T')[0];
  downloadFile(json, `transactions_${date}.json`, 'application/json');
}
