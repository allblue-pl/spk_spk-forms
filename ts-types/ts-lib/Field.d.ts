import "./Ext.ts";
import type { Layout } from "spocky";
import type { FieldValidator } from "./ts-types.ts";
export default class Field {
    #private;
    get elem(): any;
    get fullName(): string;
    get info(): {
        [fieldName: string]: any;
    };
    get value(): any;
    set value(value: any);
    constructor(layout: Layout, fieldInfo: {
        [name: string]: any;
    });
    clear(): void;
    clearValidator(): void;
    field(fieldName: string, value?: any): any;
    getLayoutElem(fieldName: string): any;
    getLayoutField(fieldName: string): any;
    init(): void;
    setDisabled(disabled: boolean): void;
    setValidator(validator: FieldValidator): void;
}
