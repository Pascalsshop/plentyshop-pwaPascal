import { describe, expect, it } from 'vitest';
import draft from '../amikon-rechtstexte-fr-vorschau.vue?raw';
import imprint from '../legal-disclosure.vue?raw';
import withdrawal from '../cancellation-rights.vue?raw';

describe('French legal preview', () => {
  it('should keep the preview development-only and non-indexable after approval', () => {
    expect(draft).toContain('if (!import.meta.dev)');
    expect(draft).toContain('statusCode: 404');
    expect(draft).toContain("content: 'noindex, nofollow'");
    expect(draft).toContain('nicht rechtlich geprüft');
    expect(draft).toContain('14.10.2026');
  });

  it('should reuse the approved components instead of duplicating legal content', () => {
    expect(draft).toContain('<AmikonFrenchLegalDisclosure />');
    expect(draft).toContain('<AmikonFrenchCancellationRights />');
    expect(draft).not.toContain('HRB 10083');
  });

  it('should retain backend legal texts for other languages and keep previews out of real pages', () => {
    for (const page of [imprint, withdrawal]) {
      expect(page).toContain('useLegalInformation()');
      expect(page).not.toContain('amikon-rechtstexte-fr-vorschau');
    }
  });
});
