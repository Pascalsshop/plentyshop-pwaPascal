const number = String.raw`[+−–-]?\s*\d+(?:[.,]\d+)?(?:[ .]\d{3})*`;
const qualifier = String.raw`(?:(?:ca\.|max\.?|min\.?|bis|[<>≤≥]|±)\s*)*`;
const range = String.raw`(?:\s*(?:bis|[-–—…]|\.\.\.)\s*${number})?`;
const measurement = (units: string) => String.raw`${qualifier}${number}${range}\s*(?:${units})`;
const dimension = String.raw`${qualifier}${number}(?:\s*[×x]\s*${number}){1,2}\s*mm`;

const field = (label: string, names: string, value: string) => ({
  label,
  pattern: new RegExp(String.raw`^(?:${names})(?:\s*:\s*|\s+)(?<value>${value})$`, 'i'),
});
const measured = (label: string, names: string, units: string) => field(label, names, measurement(units));
const labeledText = (label: string, names: string) => ({
  label,
  pattern: new RegExp(String.raw`^(?:${names})\s*:\s*(?<value>\S(?:.{0,108}[^:\s])?)$`, 'i'),
});
const fact = (label: string, names: string) => ({ ...labeledText(label, names), fromArticleFacts: true });

const manufacturer = fact('Hersteller', 'Hersteller');
const model = fact('Modell', 'Modell|Typ|Modell\\s*/\\s*Typ');
const condition = fact('Zustand', 'Zustand');
const content = fact('Inhalt', 'Inhalt');
const modelFacts = [manufacturer, model, condition];
const articleFacts = [model, manufacturer, content];
const temperature = field(
  'Temperatur',
  'Temperaturbereich',
  String.raw`${qualifier}${number}\s*(?:°\s*C)?\s*(?:bis|[–—-])\s*${qualifier}${number}\s*°\s*C`,
);
const chamberVolume = field(
  'Prüfraum',
  'Prüfraum(?:volumen|inhalt)|Prüfvolumen|Innenraumvolumen|Innenvolumen',
  String.raw`${qualifier}${number}(?:\s*[×x]\s*${number}|${range})\s*(?:Liter|l|m[³3])`,
);
const humidity = field(
  'Feuchte',
  'Feuchtebereich|Luftfeuchtebereich',
  String.raw`${qualifier}${number}\s*%?\s*(?:bis|[–—-])\s*${number}\s*%(?:\s*r\.\s*f\.)?`,
);
const voltageUnits = String.raw`V(?:\s*(?:AC|DC|VAC|VDC|Δ/Y))?|VAC|VDC`;
const supply = field(
  'Versorgungsspannung',
  'Versorgungsspannung|Eingangsspannung|Betriebsspannung|Spannung',
  String.raw`${qualifier}${number}(?:\s*/\s*${number}|${range})\s*(?:${voltageUnits})`,
);
const power = measured('Leistung', 'Nennleistung|Leistung', 'kW|W');
const interfaces = labeledText('Schnittstelle', 'Schnittstellen?|Netzwerkschnittstelle');
const ratedForce = measured('Prüfkraft', '(?:(?<maximum>Max\\.|Maximale)\\s+)?Prüfkraft(?: des Lastrahmens)?', 'kN|N');
const climateFields = [temperature, chamberVolume, humidity];

const profiles = {
  '/3d-druck': {
    name: '3D-Druck',
    aliases: ['3d-lasersinter', '3d-printen'],
    fields: [
      field('Bauvolumen', '(?:(?<maximum>Max\\.)\\s*)?Bauvolumen|Bauraum', dimension),
      labeledText('Druckverfahren', 'Druckverfahren|Drucktechnologie|Technologie'),
      measured('Schichtstärke', 'Schicht(?:stärke|dicke)(?:\\s+(?:U?HD))?', 'µm|μm|mm'),
    ],
  },
  '/maschinen': { name: 'Maschinen', aliases: ['maschinery', 'machines'], fields: modelFacts },
  '/rasterelektronenmikroskope': {
    name: 'Rasterelektronenmikroskope',
    aliases: ['scanningelectronmicroscopes', 'rasterelektronenmicroscopen'],
    fields: [
      measured('Beschleunigungsspannung', 'Beschleunigungsspannung', 'kV'),
      field(
        'Vergrößerung',
        'Vergrößerungsbereich|Vergrößerung',
        String.raw`${number}\s*(?:x|×)?\s*(?:bis|[–-])\s*${number}\s*(?:x|×|fach)`,
      ),
      measured('Auflösung', 'Auflösung', 'nm|µm|μm'),
    ],
  },
  '/roboter': {
    name: 'Roboter',
    aliases: ['robotics', 'robotica'],
    fields: [
      measured('Traglast', '(?:Nenn[- ]?)?Traglast', 'kg'),
      measured('Reichweite', '(?:(?<maximum>Maximale|max\\.)\\s+)?Reichweite', 'mm|cm|m'),
      field('Achsen', '(?:Anzahl\\s+)?Achsen', '[1-9]\\d*'),
    ],
  },
  '/shaker-schwingpruefanlagen': {
    name: 'Shaker / Schwingprüfanlagen',
    aliases: ['shaker-vibration-testing', 'schudder-trillingstesten'],
    fields: [
      measured('Kraft', 'Kraft|Nennkraft', 'kN|N'),
      measured('Schwingweg', 'Schwingweg', 'mm'),
      measured('Frequenzbereich', 'Frequenzbereich|Schwingfrequenz', 'Hz|kHz'),
    ],
  },
  '/waerme-klimaschraenke': {
    name: 'Wärme-Klimaschränke',
    aliases: ['waerme-klimaschrank', 'climate-test-cabinets', 'klimaatkamers'],
    fields: climateFields,
  },
  '/begehbare-klimakammern': {
    name: 'Begehbare Klimakammern',
    aliases: ['walk-in-climate-test-cabinets', 'inloopklimaatkasten'],
    fields: climateFields,
  },
  '/salzspruehkammern': {
    name: 'Salzsprühkammern',
    aliases: ['salt-spray-chambers', 'zoutsproeikamers'],
    fields: [
      chamberVolume,
      field(
        'Salzsprüh-Temperatur',
        'Temperaturbereich Salzsprühnebelprüfung',
        String.raw`${qualifier}${number}\s*K über Umgebungstemperatur bis\s*${number}\s*°\s*C`,
      ),
      measured(
        'Druckluftverbrauch',
        'Druckluftverbrauch(?: Salzsprühnebelprüfung)?',
        '[Nn]?m[³3]\\s*/\\s*h|l\\s*/\\s*min',
      ),
    ],
  },
  '/bewitterungstechnik': {
    name: 'Bewitterungstechnik',
    aliases: ['weathering-technology', 'weersbestendige-techniek'],
    fields: [
      labeledText('Geräteart', 'Geräteart|Prüfverfahren'),
      labeledText('Prüfmedium / Lichtquelle', 'Prüfmedium|Lichtquelle'),
      labeledText('Netzanschluss', 'Netzanschluss|Netzversorgung'),
    ],
  },
  '/elektronik': {
    name: 'Elektronik',
    aliases: ['elektronik-gesamt', 'electronics', 'electronique', 'elektronica'],
    fields: articleFacts,
  },
  '/frequenzumrichter': {
    name: 'Frequenzumrichter',
    aliases: ['frequency-converter', 'frequentieomvormer'],
    fields: [
      power,
      field(
        'Eingangsspannung',
        'Eingangsspannung|Versorgungsspannung',
        String.raw`(?:[1-3][- ]phasig,\s*)?${measurement(voltageUnits)}(?:\s*±\s*\d+\s*%)?`,
      ),
      measured('Frequenzbereich', 'Frequenzbereich|Ausgangsfrequenz', 'Hz|kHz'),
    ],
  },
  '/laborartikel': {
    name: 'Laborartikel',
    aliases: ['laboratikel', 'laboratoriumartikel'],
    fields: modelFacts,
  },
  '/lasertechnik': {
    name: 'Lasertechnik',
    aliases: ['laser-technology', 'lasertechnologie'],
    fields: [
      measured('Laserleistung', 'Laserleistung|Laser-Nennleistung', 'kW|W'),
      measured('Wellenlänge', 'Wellenlänge', 'nm|µm|μm'),
      labeledText('Lasertyp', 'Lasertyp'),
    ],
  },
  '/materialpruefmaschinen': {
    name: 'Materialprüfmaschinen',
    aliases: ['material-testing-machines', 'materiaal-testmachines'],
    fields: [
      ratedForce,
      measured('Prüfraumbreite', 'Prüfraumbreite', 'mm'),
      measured('Traversengeschwindigkeit', 'Traversengeschwindigkeit', 'mm/min'),
    ],
  },
  '/mess-prueftechnik': {
    name: 'Mess- und Prüftechnik',
    aliases: ['measuring-testing', 'meten-en-testen'],
    fields: [
      labeledText('Messbereich / Spannungsbereich', 'Messbereich|Spannungsbereich'),
      labeledText('Messgenauigkeit', 'Messgenauigkeit|Messabweichung'),
      labeledText('Anschlüsse / Schnittstellen', 'Anschlüsse|Schnittstellen?|Netzwerkschnittstelle'),
    ],
  },
  '/monitore-bedieneinheiten': {
    name: 'Monitor / Bedieneinheiten',
    aliases: ['displays-control-panels', 'displays-bedieningspanelen'],
    fields: [
      measured('Bildschirmgröße', 'Bildschirmgröße|Displaygröße|Bildschirmdiagonale|Displaydiagonale', 'Zoll|″|inch'),
      supply,
      interfaces,
    ],
  },
  '/motoren-und-antriebe': {
    name: 'Motoren und Antriebe',
    aliases: ['motors-and-drives', 'motoren-en-aandrijvingen'],
    fields: [
      power,
      field(
        'Drehzahl',
        'Nenndrehzahl|Drehzahl',
        String.raw`${measurement('U/min|1/min|min⁻¹')}(?:\s*\([^()\n]{1,45}\))?`,
      ),
      supply,
    ],
  },
  '/pneumatik': {
    name: 'Pneumatik',
    aliases: ['pneumatics', 'pneumatiek'],
    fields: [
      measured('Betriebsdruck', 'Betriebsdruck|Betriebsdruckbereich', 'bar|MPa|kPa'),
      measured('Hub', 'Hub|Hublänge', 'mm'),
      measured('Kolbendurchmesser', 'Kolben-?durchmesser', 'mm'),
    ],
  },
  '/pumpen': {
    name: 'Pumpen',
    aliases: ['pumps', 'pompen'],
    fields: [
      measured(
        'Fördermenge',
        '(?:Fördermenge|Förderleistung|Förderstrom|Volumenstrom)(?:\\s*\\((?<maximum>max\\.)\\))?',
        'm[³3]/h|l/min|l/h',
      ),
      field(
        'Betriebsdruck',
        'Betriebsdruck(?:\\s*\\((?<maximum>max\\.)\\))?|Förderdruck',
        String.raw`${measurement('bar|MPa|kPa|mbar')}(?:\s*\((?:rel\.|abs\.)\))?`,
      ),
      measured('Motorleistung', 'Motorleistung|Nennleistung|Motor', 'kW|W'),
    ],
  },
  '/sonstige-artikel': {
    name: 'Sonstige Artikel',
    aliases: ['other-articles', 'andere-artikelen', 'kategorien/sonstige'],
    fields: modelFacts,
  },
  '/thermisches-zubehoer': {
    name: 'Thermisches Zubehör',
    aliases: ['thermal-accessories', 'thermische-accessoires'],
    fields: [
      supply,
      measured('Leistungsaufnahme', 'Leistungsaufnahme(?: laut Typenschild)?', 'W|kW'),
      field('Montageausschnitt', 'Montageausschnitt|Ausschnittmaß', dimension),
    ],
  },
  '/vakuum-technik': {
    name: 'Vakuum-Technik',
    aliases: ['vacuum-technology', 'vacuuemtechnologie'],
    fields: [
      measured('Saugvermögen', 'Saugvermögen|Nennsaugvermögen', 'm[³3]/h|l/min|l/s'),
      field(
        'Enddruck',
        'Enddruck|Endvakuum',
        String.raw`${measurement('mbar|bar|Pa|Torr')}|${qualifier}${number}\s*[x×]\s*10[-−]\d+\s*(?:mbar|Pa|Torr)`,
      ),
      labeledText('Betriebsmittel', 'Betriebsmittel'),
    ],
  },
};

export const amikonArticleSpecProfiles = Object.entries(profiles).map(([path, profile]) => ({ path, ...profile }));

export function getAmikonArticleSpecProfile(path: string) {
  const segments = (path.split(/[?#]/, 1)[0] ?? '').toLowerCase().split('/').filter(Boolean);
  if (['de', 'en', 'fr', 'nl'].includes(segments[0] ?? '')) segments.shift();
  const slug = segments.join('/');

  return amikonArticleSpecProfiles.find((profile) =>
    [profile.path.slice(1), ...profile.aliases].some((prefix) => slug === prefix || slug.startsWith(prefix + '/')),
  );
}

/** Read explicitly labeled values, keeping units and qualifiers from the original. */
export function extractAmikonArticleSpecs(
  articleText: string,
  categoryPath = '/waerme-klimaschraenke',
  facts: readonly { label: string; value: string }[] = [],
) {
  const lines = articleText
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .filter(Boolean);
  // A label followed by a colon may be a heading on its own line in the article editor.
  const candidates = lines.map((line, index) => (line.endsWith(':') ? `${line} ${lines[index + 1] ?? ''}` : line));
  const fields = getAmikonArticleSpecProfile(categoryPath)?.fields ?? modelFacts;

  return fields.flatMap((rule) => {
    const { label, pattern } = rule;
    const structured =
      'fromArticleFacts' in rule
        ? facts
            .filter((entry) => entry.label === label)
            .map((entry) => entry.value.trim())
            .filter(Boolean)
        : [];
    const sourceValues = structured.length
      ? structured
      : candidates.flatMap((line) => {
          const groups = pattern.exec(line)?.groups;
          if (!groups?.value) return [];
          return [groups.maximum && !/^max\.?/i.test(groups.value) ? 'max. ' + groups.value : groups.value];
        });
    const values = new Map<string, string>();
    for (const value of sourceValues) {
      const key = value.toLowerCase().replace(/\s+/g, ' ').replace(/[−–]/g, '-');
      if (!values.has(key)) values.set(key, value);
    }
    return values.size === 1 ? Array.from(values.values(), (value) => ({ label, value })) : [];
  });
}
