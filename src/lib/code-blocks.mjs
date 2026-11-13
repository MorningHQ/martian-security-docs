const languageLabels = {
  sh: 'Shell',
  bash: 'Shell',
  python: 'Python',
  json: 'JSON',
  jsonl: 'JSONL',
  yaml: 'YAML',
  text: 'Text',
  http: 'HTTP',
};

// Keep Expressive Code's clipboard handling and accessible success feedback.
export const martianCodeBlocks = {
  name: 'Martian code block headers',
  hooks: {
    preprocessMetadata: ({ codeBlock }) => {
      if (codeBlock.props.frame === 'none') return;
      codeBlock.props.title ??= languageLabels[codeBlock.language] ?? (codeBlock.language || 'Code');
    },
    postprocessRenderedBlock: ({ codeBlock, renderData }) => {
      if (codeBlock.props.frame === 'none') return;
      const copy = renderData.blockAst.children.find(
        (node) => node.type === 'element' && node.properties?.className?.includes('copy'),
      );
      const button = copy?.children.find((node) => node.type === 'element' && node.tagName === 'button');
      if (!button) return;
      button.properties.ariaLabel = 'Copy code';
      button.children.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['copy-label'], ariaHidden: 'true' },
        children: [{ type: 'text', value: 'Copy' }],
      });
    },
  },
};
