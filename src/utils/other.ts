export function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function convertValue(
  value: string,
  type: string,
): string | number | Date {
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

export function formatDate(date: Date): string {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = date.getDate(); // Get the day of the month
  const month = months[date.getMonth()]; // Get the month name
  const hours = String(date.getHours()).padStart(2, '0'); // Pad hours with leading zero if needed
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad minutes with leading zero if needed
  const seconds = String(date.getSeconds()).padStart(2, '0'); // Pad seconds with leading zero if needed

  return `${day} ${month} ${hours}:${minutes}:${seconds}`;
}

export type UrlRedirect = {
  url: string;
}