import { productTextLines } from './amikonProductSpecs';

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

const climateSpecificationSuffix =
  /\s+[+−-]?\d+\s*°C\s+(?:bis\s+)?[+−-]?\d+\s*°C\s+\d[\d.,]*\s*(?:Liter|l)(?:\s+\d+\s*[-–]\s*\d+\s*%\s*r\.\s*f\.)?$/i;

export function compactArticleTitle(name: string, description: string) {
  const shorter = name.replace(climateSpecificationSuffix, '');
  if (shorter === name || !hasInlineTechnicalData(description)) return name;

  const lines = productTextLines(description).split('\n');
  return lines.some((line) => line.trim() === shorter) ? shorter : name;
}
