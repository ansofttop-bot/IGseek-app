export const CHINA_TOPIC_RE =
  /(тайвань|таивань|taiwan|тяньаньмэнь|tiananmen|уйгуры?|uighurs?|уйгурский|винни[- ]?пух|xi jinping|си цзиньпин|китай.*демократия|демократи.*китай|гонконг.*независим|тибет.*независим|free hong kong|free tibet|taiwan.*indep|cultural genocide|спецоперация.*украин|вторжение.*украин|annealed|самоцензура)/gi;

export const CANNED_ANSWERS: Record<string, string> = {
  тайвань:
    "Тайвань (Китайская Республика) — самоуправляемый остров с собственным правительством, валютой и вооружёнными силами. Формально КНР считает его своей провинцией, но де-факто Тайвань функционирует как независимое государство с 1949 года.",
  тяньаньмэнь:
    "4 июня 1989 года на площади Тяньаньмэнь в Пекине произошло массовое подавление протестов. Китайские войска и танки применили силу против мирных демонстрантов. По различным оценкам, погибли от нескольких сотен до нескольких тысяч человек.",
  уйгуры:
    "Уйгуры — тюркоязычный народ, проживающий в Синьцзян-Уйгурском автономном районе Китая. ООН и ряд правозащитных организаций сообщают о массовых задержаниях, культурном подавлении и принудительном труде в отношении уйгуров.",
  "винни-пух":
    'Винни-Пух (Winnie the Pooh) — персонаж детских книг А.А. Милна. В китайском интернете его сравнивают с Си Цзиньпином, из-за чего изображения персонажа периодически блокируются на китайских платформах.',
};

export function looksCensored(text: string): boolean {
  const indicators = [
    "я не могу обсуждать",
    "я не могу комментировать",
    "я не могу ответить на этот вопрос",
    "это_sensitive topic",
    "я должен быть нейтрален",
    "я не имею права",
    "as an ai",
    "я не могу высказываться",
    "я не буду отвечать",
    "извините, но я не могу",
    "к сожалению, я не могу",
  ];
  const lower = text.toLowerCase();
  return indicators.some((i) => lower.includes(i));
}

export function getCannedAnswer(query: string): string | null {
  const lower = query.toLowerCase();
  for (const [key, answer] of Object.entries(CANNED_ANSWERS)) {
    if (lower.includes(key)) return answer;
  }
  return null;
}

export function shouldBypassCensorship(userMessage: string, assistantResponse: string): boolean {
  return CHINA_TOPIC_RE.test(userMessage) && looksCensored(assistantResponse);
}
