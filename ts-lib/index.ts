import "./Ext.ts";
import Field from "./Field.ts";
import Form from "./Form.ts";
import spocky from "spocky";
import Ext from "./Ext.ts";

export class spkForms_Class {
    #debug: boolean;
    #extInitialized: boolean;
    #lang: string;


    get Field(): typeof Field {
        return Field;
    }

    get Form(): typeof Form {
        return Form;
    }


    get debug(): boolean {
        return this.#debug;
    }

    get lang(): string {
        return this.#lang;
    }

    constructor() {
        this.#debug = false;
        this.#lang = "en";
        this.#extInitialized = false;
    }

    initExt(): void {
        if (this.#extInitialized)
            throw new Error("'spk-forms' ext already initialized.");

        this.#extInitialized = true;
        spocky.ext(new Ext());
    }

    setDebug(debug: boolean): void {
        this.#debug = debug;
    }

    setLang(lang: string): void  {
        this.#lang = lang;
    }

}
const spkForms = new spkForms_Class();
export default spkForms;