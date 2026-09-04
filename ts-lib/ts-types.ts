import ts0, { type TS0RawValue, type TS0ValueType } from "@allblue/ts0";

export type FieldValidator = {
    errors: Array<string>,
    state: string,
    successes: Array<string>,
    valid: boolean,
    value: TS0RawValue,
    warnings: Array<string>,
};
export const p_FieldValidator = ts0.TPreset({
    errors: ts0.TArray("string"),
    state: "string",
    successes: ts0.TArray("string"),
    valid: "boolean",
    value: ts0.TRawValue,
    warnings: ts0.TArray("string"),
});

export type FormValidator = {
    errors: Array<string>,
    fields: {[fieldName: string]: FieldValidator},
    state: string,
    valid: boolean,
};
export const p_FormValidator = ts0.TPreset({
    errors: ts0.TArray("string"),
    fields: ts0.TObject("string", p_FieldValidator),
    state: "string",
    valid: "boolean",
});