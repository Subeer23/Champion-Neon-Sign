import React from 'react';
import { AppText } from '../../../design-system/components';
import type { FounderSourceId } from '../domain/FounderContent';
import { founderSources } from '../data/founderContent';
export function FounderAttribution({
  ids,
}: {
  ids: readonly FounderSourceId[];
}) {
  return (
    <AppText variant="caption" muted>
      Source:{' '}
      {ids
        .map(
          id =>
            `${founderSources[id].publication}${
              founderSources[id].date
                ? ` · ${founderSources[id].date?.slice(0, 4)}`
                : ''
            }`,
        )
        .join(' / ')}
    </AppText>
  );
}
