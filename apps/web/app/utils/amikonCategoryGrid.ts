import type { Block } from '@plentymarkets/shop-api';

export const findAmikonItemGrid = (blocks: Block[]): Block | undefined => {
  for (const block of blocks) {
    if (block.name === 'ItemGrid') return block;
    if (Array.isArray(block.content)) {
      const nested = findAmikonItemGrid(block.content as Block[]);
      if (nested) return nested;
    }
  }
};

/** Render-only recovery; never modifies or saves the merchant's template.
 * Existing grids, including deliberately hidden grids, are respected.
 */
export const withAmikonCategoryGrid = (blocks: Block[], grid: Block): Block[] => {
  if (findAmikonItemGrid(blocks)) return blocks;
  let inserted = false;
  const visit = (items: Block[]): Block[] =>
    items.map((block) => {
      if (inserted || !Array.isArray(block.content) || block.configuration?.visible === false) return block;
      const children = block.content as Block[];
      const widths = (block.configuration as { columnWidths?: number[] })?.columnWidths;
      if (
        block.name === 'MultiGrid' &&
        widths?.length === 2 &&
        children.some((child) => child.name === 'SortFilter' && (child.parent_slot ?? 0) === 0) &&
        !children.some((child) => child.parent_slot === 1)
      ) {
        inserted = true;
        return { ...block, content: [...children, { ...grid, parent_slot: 1 }] } as Block;
      }
      return { ...block, content: visit(children) } as Block;
    });
  const result = visit(blocks);
  return inserted ? result : [...blocks, grid];
};
