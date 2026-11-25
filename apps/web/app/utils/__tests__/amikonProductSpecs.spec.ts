import { describe, expect, it } from 'vitest';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';
import { getAmikonProductSpecs } from '../amikonProductSpecs';
import { ProductFixture } from './__fixtures__/Product';

const productIn = (name: string, parentCategoryId: number | null = null) => ({
  ...deepClone(ProductFixture),
  defaultCategories: [{ ...ProductFixture.defaultCategories![0]!, name, parentCategoryId }],
});

describe('getAmikonProductSpecs', () => {
  it('reads the published description and technical data of the active variation', () => {
    const product = productIn('Wärme-Klimaschränke');
    product.texts.description =
      '<p>Temperaturbereich: -70&deg;C bis +180&deg;C<br>Prüfraumvolumen: ca.&nbsp;335 Liter</p>';
    product.texts.technicalData = '<table><tr><th>Feuchtebereich:</th><td>10 bis 98 % r.F.</td></tr></table>';

    expect(getAmikonProductSpecs(product, [])).toEqual([
      { label: 'Temperatur', value: '-70°C bis +180°C' },
      { label: 'Prüfraum', value: 'ca. 335 Liter' },
      { label: 'Feuchte', value: '10 bis 98 % r.F.' },
    ]);
    product.texts.description = '<p>Prüfraumvolumen: 340 Liter</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([
      { label: 'Prüfraum', value: '340 Liter' },
      { label: 'Feuchte', value: '10 bis 98 % r.F.' },
    ]);
  });

  it('uses the default category even when the current breadcrumb is in another category', () => {
    const product = productIn('Roboter');
    product.breadcrumbs = [{ id: 2, level: 1, name: 'Pumpen', url: '/pumpen' }];
    product.texts.description = '<p>Traglast: 180 kg</p><p>Fördermenge: 1 l/min</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([{ label: 'Traglast', value: '180 kg' }]);
  });

  it('uses an explicit category profile even under a different parent in the breadcrumb path', () => {
    const product = productIn('Pumpen');
    product.breadcrumbs = [
      { id: product.defaultCategories[0]!.id, level: 2, name: 'Pumpen', url: '/elektronik-gesamt/pumpen' },
    ];
    product.texts.description = '<p>Fördermenge: 2 l/min</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([{ label: 'Fördermenge', value: '2 l/min' }]);
  });

  it('keeps the maximum and approximate qualifiers on a robot reach', () => {
    const product = productIn('Roboter');
    product.texts.description = '<p>Maximale Reichweite: ca. 2496 mm</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([{ label: 'Reichweite', value: 'max. ca. 2496 mm' }]);
  });

  it('uses the reach on the robot nameplate and reads the axis count before the mounting note', () => {
    const product = productIn('Roboter');
    product.texts.description =
      '<p>Nenn-Traglast: 500 kg<br>Max. Traglast laut Datenblatt: 611 kg*<br>' +
      'Reichweite laut Typenschild: 2.828 mm<br>Reichweite laut Datenblatt: 2.826 mm<br>' +
      'Achsen: 6 / Bodenmontage</p>';

    expect(getAmikonProductSpecs(product, [])).toEqual([
      { label: 'Traglast', value: '500 kg' },
      { label: 'Reichweite', value: '2.828 mm' },
      { label: 'Achsen', value: '6' },
    ]);
  });

  it('uses the datasheet reach when it is the only value and skips conflicting nameplate values', () => {
    const product = productIn('Roboter');
    product.texts.description = '<p>Reichweite laut Datenblatt: 2.826 mm<br>Anzahl der Achsen 6</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([
      { label: 'Reichweite', value: '2.826 mm' },
      { label: 'Achsen', value: '6' },
    ]);

    product.texts.technicalData =
      '<p>Reichweite laut Typenschild: 2.828 mm<br>Reichweite laut Typenschild: 2.900 mm</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([{ label: 'Achsen', value: '6' }]);
  });

  it('skips products without a recognized category or explicit specifications', () => {
    const product = productIn('Roboter');
    expect(getAmikonProductSpecs(product, [])).toEqual([]);
    product.defaultCategories[0]!.name = 'Unbekannt';
    product.texts.description = '<p>Traglast: 2 kg</p>';
    expect(getAmikonProductSpecs(product, [])).toEqual([]);
  });

  it('uses the parent category for an unrecognized subcategory', () => {
    const product = productIn('Unterkategorie', 4);
    const branch: CategoryTreeItem[] = [
      {
        id: 4,
        type: 'item',
        itemCount: [],
        childCount: 0,
        right: 'all',
        details: [
          {
            name: 'Vakuum-Technik',
            nameUrl: 'vakuum-technik',
            lang: 'de',
            metaTitle: '',
            imagePath: null,
            image2Path: null,
          },
        ],
      },
    ];
    product.texts.description = '<p>Enddruck: &lt; 4 x 10-2 mbar</p>';
    expect(getAmikonProductSpecs(product, branch)).toEqual([{ label: 'Enddruck', value: '< 4 x 10-2 mbar' }]);
  });

  it('omits conflicting values and ignores data embedded in non-visible markup', () => {
    const product = productIn('Roboter');
    product.texts.description = '<p>Traglast: 180 kg</p><template>Achsen: 2</template>';
    product.texts.technicalData = '<p>Traglast: 200 kg</p><!-- Reichweite: 2 m -->';
    expect(getAmikonProductSpecs(product, [])).toEqual([]);
  });

  it('uses the exact variation model and omits a content amount if it is missing', () => {
    const product = productIn('Elektronik');
    product.variation.model = '6ES7331-1KF01-0AB0';
    product.unit.content = 0;
    const facts = getAmikonProductSpecs(product, []);
    expect(facts).toContainEqual({ label: 'Modell', value: '6ES7331-1KF01-0AB0' });
    expect(facts.some(({ label }) => label === 'Inhalt')).toBe(false);
  });
});
