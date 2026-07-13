import ts0, { type TS0ValueType } from "@allblue/ts0";

export type FieldValidator = {
    errors: Array<string>,
    state: string,
    successes: Array<string>,
    valid: boolean,
    value: string,
    warnings: Array<string>,
};
export const presets_FieldValidator: TS0ValueType = ts0.TPreset({
    errors: ts0.TArray("string"),
    state: "string",
    successes: ts0.TArray("string"),
    valid: "boolean",
    value: "string",
    warnings: ts0.TArray("string"),
});

export type FormValidator = {
    errors: Array<string>,
    fields: {[fieldName: string]: FieldValidator},
    state: string,
    valid: boolean,
};
export const presets_FormValidator: TS0ValueType = ts0.TPreset({
    errors: ts0.TArray("string"),
    fields: ts0.TObject("string", presets_FieldValidator),
    state: "string",
    valid: "boolean",
});