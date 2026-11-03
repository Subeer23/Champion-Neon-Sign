export type FounderSourceId =
  | 'official'
  | 'gn2019'
  | 'gn2020'
  | 'gn2026'
  | 'retail2026'
  | 'kt2006';
export interface FounderSource {
  id: FounderSourceId;
  title: string;
  publication: string;
  date: string | null;
  dateKind: 'published' | 'updated' | 'upload' | 'not-stated';
  dateLabel: string;
  url: `https://${string}`;
  reviewedOn: string;
  access: 'full-text' | 'indexed-excerpt';
  locator?: string;
}
export interface SourcedFounderText {
  text: string;
  sourceIds: readonly FounderSourceId[];
}
export interface FounderSection extends SourcedFounderText {
  id: string;
  title: string;
}
export interface FounderMilestone extends FounderSection {
  period: string;
}
export interface FounderContent {
  name: SourcedFounderText;
  designation: SourcedFounderText;
  initials: string;
  portrait:
    | { kind: 'initials'; reason: 'awaiting-approved-photograph' }
    | {
        kind: 'photo';
        imageId: string;
        approval: 'user-provided';
        providedOn: string;
      };
  introduction: SourcedFounderText;
  sections: readonly FounderSection[];
  timeline: readonly FounderMilestone[];
}
