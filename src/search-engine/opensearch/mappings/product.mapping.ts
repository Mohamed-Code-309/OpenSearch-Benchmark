export const productMapping = {
  mappings: {
    properties: {
      id: { type: 'keyword' },
      name: { type: 'text' },
      description: { type: 'text' },
      category: { type: 'keyword' },
      price: { type: 'float' },
      brand: { type: 'keyword' },
      createdAt: { type: 'date' },
    },
  },
};
