/** A website showcase, not an invented client case study. */
export interface Project {
  id: string;
  title: string;
  summary: string;
  description?: string;
  sourceUrl?: string;
  solutionIds: string[];
  imageIds: string[];
}
