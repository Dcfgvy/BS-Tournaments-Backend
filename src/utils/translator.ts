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
    en: "👋 Hi, {{ username }}, you didn't provide the verification data",
    ru: "👋 Привет, {{ username }}, не было получено данных для привязки аккаунта"
  },
  "The link is invalid or expired. Please try again": {
    en: "❌ The link is invalid or expired. Please try again",
    ru: "❌ Ссылка недействительна. Пожалуйста, получите новую ссылку"
  },
  "This Telegram account is already in use by another account": {
    en: "❌ This Telegram account is already in use by another account",
    ru: "❌ Этот аккаунт Telegram уже привязан к другому аккаунту"
  },
  "This Telegram account has been unlinked. You can now log in only using your tag and password.": {
    en: "❗️ This Telegram account has been unlinked. You can now log in only using your tag and password.",
    ru: "❗️ Этот Telegram аккаунт был отвязан от вашей учетной записи. Теперь вы можете войти только через тег и пароль."
  },
  "Tournament post": {
    en: `<b>🏆 Tournament - {{ eventName }} 🏆</b>

🗺 Map - <b>{{ mapName }}</b> 🗺

➕ ENTRY FEE: <b>{{entryCost}}💰</b>

👥 PLAYERS: <b>{{ playersNumber }}</b>
    
💸 Prize fund: 💸`,
    // start ru
    ru: `<b>🏆 Турнир - {{ eventName }} 🏆</b>

🗺 Карта - <b>{{ mapName }}</b> 🗺

➕ ВХОД: <b>{{entryCost}}💰</b>

👥 ИГРОКОВ: <b>{{ playersNumber }}</b>

💸 Призовой фонд: 💸`,
  },
};

export function _(name: string, language: string, parameters?: Record<string, any>): string {
  if(texts[name]){
    const template: string = texts[name][language] || texts[name]["en"];
    if(parameters){
      return template.replace(/{{(.*?)}}/g, (fullStr, key: string) => parameters[key.trim()] || '');
    }
    return template;
  }
  else return name;
}

export function translatePlace(place: number, language: string, parameters?: Record<string, any>): string {
  const places: Texts = {
    "1": {
      en: "🥇 PLACE: <b>{{prize}}</b>💰",
      ru: "🥇 МЕСТО: <b>{{prize}}</b>💰"
    },
    "2": {
      en: "🥈 PLACE: <b>{{prize}}</b>💰",
      ru: "🥈 МЕСТО: <b>{{prize}}</b>💰"
    },
    "3": {
      en: "🥉 PLACE: <b>{{prize}}</b>💰",
      ru: "🥉 МЕСТО: <b>{{prize}}</b>💰"
    },
    "other": {
      en: "  <b>{{ place }}-th</b> PLACE: <b>{{prize}}</b>💰",
      ru: "  <b>{{ place }}-ое</b> МЕСТО: <b>{{prize}}</b>💰"
    }
  };

  let template: string;
  if(places[String(place)] && places[String(place)][language]){
    template = places[String(place)][language];
  }
  else if(places["other"][language]){
    template = places["other"][language];
  }
  else{
    template = places["other"]["en"];
  }
  parameters["place"] = place;
  return template.replace(/{{(.*?)}}/g, (fullStr, key: string) => parameters[key.trim()] || '');
}