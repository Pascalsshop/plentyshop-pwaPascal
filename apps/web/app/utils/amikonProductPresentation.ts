import { productTextLines } from './amikonProductSpecs';

export const articleIntroductionId = 'amikon-artikelbeschreibung';
export const inlineTechnicalDataId = 'amikon-technische-daten';

const technicalHeading =
  /(<(h[2-6]|p)(?:\s[^>]*)?>)\s*(?:Technische Daten|Technical data|Caractéristiques techniques|Technische gegevens)\s*:?\s*<\/\2\s*>/i;

export function hasInlineTechnicalData(html: string) {
  return technicalHeading.test(html);
}

export function addInlineTechnicalDataAnchor(html: string) {
  return html.replace(technicalHeading, (heading, openingTag: string) => {
    const anchor = '<span id="' + inlineTechnicalDataId + '" aria-hidden="true"></span>';
    return openingTag + anchor + heading.slice(openingTag.length);
  });
}

const singleLineText = (html: string) => productTextLines(html).trim().replace(/\s+/g, ' ');

export function articleIntroduction(shortDescription: string, description: string) {
  const authoredSummary = singleLineText(shortDescription);
  if (authoredSummary && authoredSummary.length <= 320) return authoredSummary;

  const opening = description.split(technicalHeading, 1)[0] ?? '';
  for (const paragraph of opening.matchAll(/<(p|h[3-6])(?:\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi)) {
    const text = singleLineText(paragraph[2] ?? '');
    if (text.length >= 100 && text.length <= 320 && /[.!?]$/.test(text)) return text;
  }
  return '';
}

const climateSpecificationSuffix =
  /\s+[+−-]?\d+\s*°C\s+(?:bis\s+)?[+−-]?\d+\s*°C\s+\d[\d.,]*\s*(?:Liter|l)(?:\s+\d+\s*[-–]\s*\d+\s*%\s*r\.\s*f\.)?$/i;

export function compactArticleTitle(name: string, description: string) {
  const shorter = name.replace(climateSpecificationSuffix, '');
  if (shorter === name || !hasInlineTechnicalData(description)) return name;

  const lines = productTextLines(description).split('\n');
  return lines.some((line) => line.trim() === shorter) ? shorter : name;
}
