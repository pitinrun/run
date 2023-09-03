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
