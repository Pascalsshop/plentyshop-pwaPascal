import { describe, expect, it } from 'vitest';
import draft from '../amikon-rechtstexte-fr-vorschau.vue?raw';
import imprint from '../legal-disclosure.vue?raw';
import withdrawal from '../cancellation-rights.vue?raw';

describe('French legal approval preview', () => {
  it('should keep the unapproved draft development-only and non-indexable', () => {
    expect(draft).toContain('if (!import.meta.dev)');
    expect(draft).toContain('statusCode: 404');
    expect(draft).toContain("content: 'noindex, nofollow'");
    expect(draft).toContain('Nicht rechtlich geprüft');
    expect(draft).toContain('nicht veröffentlicht');
  });

  it('should include both French drafts and all withdrawal print fields', () => {
    expect(draft.match(/lang="fr"/g)).toHaveLength(2);
    expect(draft).toContain('Mentions légales');
    expect(draft).toContain('B. Formulaire de rétractation');
    expect(draft).toContain('Nous prenons en charge les frais de retour des biens.');
    expect(draft.replace(/\s+/g, ' ')).toContain('au plus tard quatorze jours');
    expect(draft).toContain('Nom du/des consommateur(s)');
    expect(draft).toContain('Adresse du/des consommateur(s)');
    expect(draft).toContain('Signature du/des consommateur(s)');
    expect(draft).toContain('Rayez la mention inutile');
  });

  it('should preserve the company identifiers without changing real legal page data sources', () => {
    expect(draft).toContain('HRB 10083');
    expect(draft).toContain('DE814645334');
    expect(draft).toContain('Dirk Kleinfeld');
    for (const page of [imprint, withdrawal]) {
      expect(page).toContain('useLegalInformation()');
      expect(page).not.toContain('amikon-rechtstexte-fr-vorschau');
    }
  });
});
