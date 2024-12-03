import { INames } from "./names";

type Texts = {
  [key: string]: INames;
};

const texts: Texts = {
  "Your Telegram account was successfully connected": {
    en: "✅ Your Telegram account was successfully connected!",
    ru: "✅ Ваш аккаунт Telegram был успешно привязан!"
  },
  "Hi, username, you didn't provide the verification data": {
    en: "Hi, {{ username }}, you didn't provide the verification data",
    ru: "Привет, {{ username }}, не было получено данных для привязки аккаунта"
  },
  "The link is invalid or expired. Please try again": {
    en: "The link is invalid or expired. Please try again",
    ru: "Ссылка недействительна. Пожалуйста, получите новую ссылку"
  },
  "This Telegram account has been unlinked. You can now log in only using your tag and password.": {
    en: "❗️ This Telegram account has been unlinked. You can now log in only using your tag and password.",
    ru: "❗️ Этот Telegram аккаунт был отвязан от вашей учетной записи. Теперь вы можете войти только через тег и пароль."
  },
};

export function _(name: string, language: string, parameters?: Record<string, string>): string {
  const template: string = texts[name][language] || texts[name]["en"];
  if(parameters){
    return template.replace(/{{(.*?)}}/g, (fullStr, key: string) => parameters[key.trim()] || '');
  }
  return template;
}