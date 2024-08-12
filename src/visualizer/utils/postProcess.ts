import {
  DataSpec,
  DisplayPosition,
  DisplaySpec,
  EntitySpec,
  GistvisSpec,
} from "../types";
import { fuzzySearch } from "./fuzzySearch";
import _ from "lodash";

export const getInsituPos = (gistVisSpec: GistvisSpec): EntitySpec[] => {
  let inSituPosition: string[] =
    gistVisSpec.unitSegmentSpec.inSituPosition ?? [];
  return inSituPosition
    .map((str: string) => {
      const pos = fuzzySearch(str, gistVisSpec.unitSegmentSpec.context, false);
      const posArray = pos.map((p) => {
        return {
          entity: str,
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
        } as EntitySpec;
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

export const getNonOverlappingEntities = (entityPos: EntitySpec[]) => {
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
  return nonOverlappingEntities;
};

export const getProductionVisSpec = (
  text: string,
  entityPos: EntitySpec[],
  displayPos: DisplayPosition = "none"
) => {
  const nonOverlappingEntities = getNonOverlappingEntities(entityPos);

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
      content: text.slice(entity.postion.start, entity.postion.end),
      entity: entity.entity,
    });
    if (displayPos === "right") {
      contentArray.push({
        displayType: "word-scale-vis",
        content: " ",
      });
    }
    lastEnd = entity.postion.end;
  });

  if (lastEnd < text.length) {
    contentArray.push({
      displayType: "text",
      content: text.slice(lastEnd, text.length - 1),
    });
    if (displayPos === "none") {
      contentArray.push({
        displayType: "word-scale-vis",
        content: " ",
      });
    }
    contentArray.push({
      displayType: "text",
      content: text.slice(text.length - 1) + " ",
    });
  }
  return contentArray;
};
