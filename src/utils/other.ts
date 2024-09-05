export function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function convertValue(value: string, type: string): string | number | Date {
  if (type === 'string') {
      return value;
  } else if (type === 'number') {
      const numberValue = parseFloat(value);
      if (isNaN(numberValue)) {
          throw new Error(`Cannot convert '${value}' to number`);
      }
      return numberValue;
  } else if (type === 'date') {
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
          throw new Error(`Cannot convert '${value}' to Date`);
      }
      return dateValue;
  } else {
      throw new Error(`Unknown type: ${type}`);
  }
}
