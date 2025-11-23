function getSqlCompatibleFileNameDateTime(): string {
  const now = new Date();

  // Format: YYYY-MM-DD_HH-MM-SS (24-hour clock, zero-padded)
  // This is safe for Windows filenames and commonly used for SQL dumps/backups
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}
