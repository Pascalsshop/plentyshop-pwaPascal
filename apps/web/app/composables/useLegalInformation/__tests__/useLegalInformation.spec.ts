import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useLegalInformation } from '../useLegalInformation';
import type { UseLegalInformationState } from '../types';

const { fetchLegal, asyncData, handleError } = vi.hoisted(() => ({
  fetchLegal: vi.fn(),
  asyncData: vi.fn(),
  handleError: vi.fn(),
}));
mockNuxtImport('useSdk', () => () => ({ plentysystems: { getLegalTexts: fetchLegal } }));
mockNuxtImport('useAsyncData', () => asyncData);
mockNuxtImport('useHandleError', () => handleError);
mockNuxtImport('useI18n', () => () => ({ locale: { value: 'de' } }));

describe('Legal text loading with simulated API responses', () => {
  beforeEach(() => {
    fetchLegal.mockReset();
    useState<UseLegalInformationState>('useLegalInformation').value = {
      data: {} as UseLegalInformationState['data'],
      loading: false,
    };
    asyncData.mockImplementation(async (_key, handler) => {
      try {
        return { data: { value: await handler() }, error: { value: null } };
      } catch (error) {
        return { data: { value: null }, error: { value: error } };
      }
    });
  });

  it('should remain loading until a delayed API response resolves and preserve the returned text', async () => {
    const response = { data: { htmlText: '<p>Unchanged configured legal text</p>' } };
    const delayed = Promise.withResolvers<typeof response>();
    fetchLegal.mockReturnValueOnce(delayed.promise);
    const legal = useLegalInformation();
    const request = legal.getLegalTexts({ type: 'PrivacyPolicy' });

    expect(legal.loading.value).toBe(true);
    expect(legal.data.value).toEqual({});
    expect(fetchLegal).toHaveBeenCalledExactlyOnceWith({ type: 'PrivacyPolicy' });

    delayed.resolve(response);
    await request;

    expect(legal.loading.value).toBe(false);
    expect(legal.data.value).toEqual(response.data);
  });

  it('should clear the previous legal text and finish loading for an empty API response', async () => {
    fetchLegal.mockResolvedValueOnce({ data: { htmlText: '<p>Previous page</p>' } });
    const legal = useLegalInformation();
    await legal.getLegalTexts({ type: 'LegalDisclosure' });
    fetchLegal.mockResolvedValueOnce({ data: undefined });

    await legal.getLegalTexts({ type: 'PrivacyPolicy' });

    expect(legal.loading.value).toBe(false);
    expect(legal.data.value).toEqual({});
  });

  it('should clear the previous text and retain the error when an API request fails', async () => {
    fetchLegal.mockResolvedValueOnce({ data: { htmlText: '<p>Previous page</p>' } });
    const legal = useLegalInformation();
    await legal.getLegalTexts({ type: 'LegalDisclosure' });
    const error = new Error('Simulated backend failure');
    fetchLegal.mockRejectedValueOnce(error);

    await legal.getLegalTexts({ type: 'PrivacyPolicy' });

    expect(legal.loading.value).toBe(false);
    expect(legal.data.value).toEqual({});
    expect(handleError).toHaveBeenLastCalledWith(error);
  });
});
