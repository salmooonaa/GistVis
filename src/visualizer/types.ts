// Intermediate representation for GistVis
export type InsightType =
  | "comparison"
  | "trend"
  | "rank"
  | "proportion"
  | "extreme"
  | "value"
  | "noType";

export type ExtremeAttribute = "maximum" | "minimum";
export type TrendAttribute = "positive" | "negative";
export type Attribute = ExtremeAttribute | TrendAttribute;

export type DataSpec = {
  categoryKey: string,
  categoryValue: string,
  valueKey: string,
  valueValue: number,
}

export type UnitSegmentSpec = {
  insightType: InsightType,
  segmentIdx: number,
  context: string,
  attribute?: Attribute
  inSituPosition?: string[]
}

export interface GistvisSpec {
  id: string,
  unitSegmentSpec: UnitSegmentSpec,
  dataSpec?: DataSpec[],
}

export type paragraphSpec = {
  paragraphIdx: number;
  paragraphContent: GistvisSpec[];
};

// Visualizer specifications
export type TextPosition = {
  start: number;
  end: number;
};

export type EntitySpec = {
  entity: string;
  postion: TextPosition;
}

export type DisplayType = "text" | "entity" | "word-scale-vis";
export type DisplayPosition = "above" | "overlay" | "right" | "none";

export type DisplaySpec = {
  displayType: DisplayType;
  content: string;
  entity?: string;
  displayPosition?: DisplayPosition; // currently not supported
}

export interface ChartProps {
  gistvisSpec: GistvisSpec;
  colorScale: d3.ScaleOrdinal<string, string, never>;
  selectedEntity: string;
  setSelectedEntity: (entity: string) => void;
}

export interface DataPoint {
  x: number;
  y: number;
}