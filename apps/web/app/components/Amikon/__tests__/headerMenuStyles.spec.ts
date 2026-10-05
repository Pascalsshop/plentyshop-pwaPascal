import { readFileSync } from 'node:fs';
import { baseParse, NodeTypes, type TemplateChildNode } from '@vue/compiler-dom';
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = new URL('../Header.vue', import.meta.url);
const { descriptor } = parse(readFileSync(filename, 'utf8'), { filename: filename.pathname });

describe('Amikon header menu styling', () => {
  it('uses the same Amikon blue and white text for all header menu hover states', () => {
    const menuClasses: string[] = [];
    const collect = (nodes: TemplateChildNode[]) => {
      for (const node of nodes) {
        if (node.type !== NodeTypes.ELEMENT || node.tag === 'form') continue;
        const classAttribute = node.props.find((prop) => prop.type === NodeTypes.ATTRIBUTE && prop.name === 'class');
        if (classAttribute?.type === NodeTypes.ATTRIBUTE && classAttribute.value?.content.includes('hover:bg-')) {
          menuClasses.push(classAttribute.value.content);
        }
        collect(node.children);
      }
    };
    collect(baseParse(descriptor.template!.content).children);

    expect(menuClasses.length).toBeGreaterThan(20);
    for (const classes of menuClasses) {
      expect(classes.match(/hover:bg-[\w-]+/g)).toEqual(['hover:bg-amikon-600']);
      expect(classes.split(/\s+/)).toContain('hover:text-white');
    }
  });

  it('keeps the header script and template compilable with the hover interaction', () => {
    const script = compileScript(descriptor, { id: 'amikon-header-menu-test' });
    const template = compileTemplate({
      source: descriptor.template!.content,
      filename: filename.pathname,
      id: 'amikon-header-menu-test',
      compilerOptions: { bindingMetadata: script.bindings },
    });
    expect(template.errors).toEqual([]);
    expect(script.bindings?.openDesktopMenuOnHover).toBeDefined();
    expect(template.code).toContain('onPointerenter:');
  });
});
