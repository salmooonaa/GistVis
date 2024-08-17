import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

export const SpecDescriptions = {
  ID_DESCRIPTION: "unique id of text block",
  CONTEXT_DESCRIPTION: "original text provided by the user",
  CATEGORY_KEY_DESCRIPTION:
    "The category of the entity of the data item according to the context. If it does not exist, return an empty string",
  CATEGORY_VALUE_DESCRIPTION:
    "The entity of the data item. If it does not exist, return an empty string",
  VALUE_KEY_DESCRIPTION:
    "The definition of the value of the data item according to the context. If it does not exist or is uncertain, return an empty string",
  VALUE_VALUE_DESCRIPTION:
    "The value (only numbers) of the value of the data item. If it does not exist or is uncertain, return NAN",
};

export const ExtractOutputParser = StructuredOutputParser.fromZodSchema(
  z.object({
    dataSpec: z.array(
      z.object({
        categoryKey: z
          .string()
          .describe(SpecDescriptions.CATEGORY_KEY_DESCRIPTION),
        categoryValue: z
          .string()
          .describe(SpecDescriptions.CATEGORY_VALUE_DESCRIPTION),
        valueKey: z.string().describe(SpecDescriptions.VALUE_KEY_DESCRIPTION),
        valueValue: z
          .union([z.number(), z.string()])
          .transform((value: string | number) => {
            if (typeof value === "string" && value.toUpperCase() === "NAN") {
              return NaN;
            } else {
              return typeof value === "string" ? parseFloat(value) : value;
            }
          })
          .describe(SpecDescriptions.VALUE_VALUE_DESCRIPTION),
      })
    ),
  })
);
