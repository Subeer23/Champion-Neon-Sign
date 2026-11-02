import React from 'react';
import Renderer, { act } from 'react-test-renderer';
import { CatalogList } from '../shared/components/CatalogList';
import { SearchField } from '../shared/components/SearchField';
import { SolutionIcon } from '../shared/components/SolutionIcon';

jest.mock('../shared/components/SolutionIcon', () => ({
  SolutionIcon: jest.fn(() => null),
}));
it('preserves unchanged catalog rows when search removes a sibling', async () => {
  const items = [
    { id: 'signage', title: 'Signage', summary: 'Signs' },
    { id: 'branding', title: 'Branding', summary: 'Brands' },
  ];
  const onSelect = jest.fn();
  let renderer!: Renderer.ReactTestRenderer;
  jest.mocked(SolutionIcon).mockClear();
  await act(() => {
    renderer = Renderer.create(
      <CatalogList
        title="Solutions"
        description="Services"
        verb="Explore"
        items={items}
        loading={false}
        error={false}
        onRetry={jest.fn()}
        onSelect={onSelect}
      />,
    );
  });
  expect(SolutionIcon).toHaveBeenCalledTimes(2);
  await act(() =>
    renderer.root.findByType(SearchField).props.onChangeText('Signage'),
  );
  expect(SolutionIcon).toHaveBeenCalledTimes(2);
  await act(() => renderer.unmount());
});
