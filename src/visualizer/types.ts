export type InsightType =
  | "comparison"
  | "trend"
  | "rank"
  | "proportion"
  | "anomoly"
  | "extreme"
  | "value"
  | "noType";

export type DataSpec = {
  categoryKey: string,
  categoryValue: string,
  valueKey: string,
  valueValue: number,
}

export type UnitSegmentSpec = {
  insightType: InsightType,
  paragraphIdx: number,
  segmentIdx: number,
  context: string,
}

export interface GistvisSpec {
  id: string,
  paragraphSpec: UnitSegmentSpec,
  dataSpec?: DataSpec[]
}