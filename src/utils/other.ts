import { appConfig } from "./appConfigs";

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

export function validateTgUserPayload(data: any): boolean {
  if(
    typeof data.user?.id !== 'number' ||
    typeof data.hash !== 'string'
  ) return false;

  // Get Telegram hash
	const hash = data.hash;

	// Remove 'hash' value & Sort alphabetically
	const data_keys = Object.keys(data).filter(v => v !== 'hash').sort();

	// Create line format key=<value>
	const items = data_keys.map(key => key + '=' + data[key]);

	// Create check string with a line feed
	// character ('\n', 0x0A) used as separator
	// result: 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>'
	const data_check_string = items.join('\n');

	function HMAC_SHA256(value, key) {
		const crypto = require('crypto');
		return crypto.createHmac('sha256', key).update(value).digest();
	}

	function hex(bytes) {
		return bytes.toString('hex');
	}

	// Generate secret key
	const secret_key = HMAC_SHA256(appConfig.TELEGRAM_BOT_TOKEN, 'WebAppData');

	// Generate hash to validate
	const hashGenerated = hex(HMAC_SHA256(data_check_string, secret_key));

	// Return bool value is valid
	return hashGenerated === hash;
}
