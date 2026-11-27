import {
  addInlineTechnicalDataAnchor,
  articleIntroduction,
  compactArticleTitle,
  hasInlineTechnicalData,
} from '../amikonProductPresentation';

describe('Amikon product presentation', () => {
  const productName = 'Weiss WK3-340/70 Klimaprüfschrank';
  const catalogTitle = productName + ' -70°C +180°C 335 Liter 10-98% r.F.';

  it('shows the shorter authored product name for a repeated climate specification suffix', () => {
    const article = '<h5>' + productName + '</h5><h5>Technische Daten:</h5><p>Prüfraum: 335 Liter</p>';
    expect(compactArticleTitle(catalogTitle, article)).toBe(productName);
    expect(compactArticleTitle(catalogTitle, '<h5>' + productName + '</h5>')).toBe(catalogTitle);
    expect(compactArticleTitle(catalogTitle, '<p>Prüfschrank von Weiss.</p>')).toBe(catalogTitle);
    expect(compactArticleTitle(catalogTitle + ' mit Zubehör', '<h5>' + productName + '</h5>')).toBe(
      catalogTitle + ' mit Zubehör',
    );
  });

  it('links to an existing technical heading while preserving the catalog copy', () => {
    const description = '<h5 style="text-align:center;">Technische Daten:</h5><p>Prüfraumvolumen: ca. 335 Liter</p>';
    expect(hasInlineTechnicalData(description)).toBe(true);
    expect(addInlineTechnicalDataAnchor(description)).toBe(
      description.replace(
        '>Technische Daten:',
        '><span id="amikon-technische-daten" aria-hidden="true"></span>Technische Daten:',
      ),
    );
    expect(hasInlineTechnicalData('<p>Technische Daten folgen.</p>')).toBe(false);
    expect(hasInlineTechnicalData('<p>Technische Daten:</p><p>Prüfraumvolumen: ca. 335 Liter</p>')).toBe(true);
  });

  it('uses the authored short description or an intact paragraph before the technical data', () => {
    const paragraph =
      'Der Klimaprüfschrank eignet sich für Temperatur- und Feuchteprüfungen, Umweltsimulation, Materialprüfung und Qualitätssicherung.';
    const description = '<h5>' + paragraph + '</h5><h5>Technische Daten:</h5><h5>Temperaturbereich</h5>';
    expect(articleIntroduction('<p>Beschreibung&nbsp;des Artikels.</p>', description)).toBe(
      'Beschreibung des Artikels.',
    );
    expect(articleIntroduction('', description)).toBe(paragraph);
    expect(articleIntroduction('', '<h5>Technische Daten:</h5><p>' + paragraph + '</p>')).toBe('');
  });
});
