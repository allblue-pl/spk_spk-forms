import "./Ext.ts";
import Field from "./Field.ts";
import Form from "./Form.ts";
export declare class spkForms_Class {
    #private;
    get Field(): typeof Field;
    get Form(): typeof Form;
    get debug(): boolean;
    get lang(): string;
    constructor();
    initExt(): void;
    setDebug(debug: boolean): void;
    setLang(lang: string): void;
}
declare const spkForms: spkForms_Class;
export default spkForms;
