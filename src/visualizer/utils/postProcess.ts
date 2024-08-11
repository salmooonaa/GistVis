import { DataSpec, DisplaySpec, EntitySpec, GistvisSpec } from "../types";
import { fuzzySearch } from "./fuzzySearch";
import _ from "lodash";

export const getEntityPos = (gistvisSpec: GistvisSpec): EntitySpec[] => {
  let dataSpec: DataSpec[] = gistvisSpec.dataSpec ?? [];
  return dataSpec
    .map((d: DataSpec) => {
      const pos = fuzzySearch(
        d.categoryValue,
        gistvisSpec.unitSegmentSpec.context,
        false
      );
      // if position is multiple, then map
      const posArray = pos.map((p) => {
        return {
          entity: d.categoryValue,
          postion: {
            start: p[0],
            end: p[1],
          },
        };
      });
      return posArray;
    })
    .flat();
};

export const getUniqueEntities = (entityPos: EntitySpec[]) => {
  return _.uniqBy(
    entityPos.map((d) => d.entity),
    "entity"
  );
};

export const getProductionVisSpec = (text: string, entityPos: EntitySpec[]) => {
  // Sort entityPos by start position using lodash
  const sortedEntityPos = _.sortBy(entityPos, ["postion.start"]);
  // Filter out overlapping entities using reduce
  const nonOverlappingEntities = sortedEntityPos.reduce(
    (acc: EntitySpec[], entity: EntitySpec) => {
      if (
        acc.length === 0 ||
        entity.postion.start >= acc[acc.length - 1].postion.end
      ) {
        return [...acc, entity];
      }
      return acc;
    },
    []
  );

  const contentArray: DisplaySpec[] = [];
  let lastEnd = 0;
  nonOverlappingEntities.forEach((entity) => {
    if (entity.postion.start > lastEnd) {
      contentArray.push({
        displayType: "text",
        content: text.slice(lastEnd, entity.postion.start),
      });
    }
    contentArray.push({
      displayType: "entity",
      content: text.slice(entity.postion.start, entity.postion.end + 1),
      entity: entity.entity,
    });
    lastEnd = entity.postion.end;
  });

  if (lastEnd < text.length) {
    contentArray.push({
      displayType: "text",
      content: text.slice(lastEnd, text.length - 1),
    });
    contentArray.push({
      displayType: "word-scale-vis",
      content: " ",
    });
    contentArray.push({
      displayType: "text",
      content: text.slice(text.length - 1) + " ",
    });
  }
  return contentArray;
};
