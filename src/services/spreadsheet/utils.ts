export function toColumnName(col: number): string {
  let dividend = col
  let columnName = ''
  let modulo: number

  while (dividend > 0) {
    modulo = (dividend - 1) % 26
    columnName = String.fromCharCode(65 + modulo) + columnName
    dividend = Math.floor((dividend - modulo) / 26)
  }

  return columnName
}

export function fromColumnName(columnName: string): number {
  let total = 0;
  let multiplier = 1; // Represents position (1s, 10s, 100s,...)

  // Iterate over each character starting from the rightmost side
  for (let i = columnName.length - 1; i >= 0; i--) {
    const char = columnName[i];
    const value = char.charCodeAt(0) - 64; // 'A' starts at 65

    total += value * multiplier;
    multiplier *= 26; // Move to the next position
  }

  return total;
}
