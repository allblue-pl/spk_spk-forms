import "./Ext.ts";
import abDate from "ab-date";
import spkForms from "./index.js";
import type { Layout } from "spocky";
import ts0, { ts0Assert } from "@allblue/ts0";
import type { FieldValidator } from "./ts-types.ts";
/* @ab-ignore */
import $ from "jquery";
import type Form from "./Form.ts";


export default class Field {
    #disabled: boolean;
    #layout: Layout;
    #form: Form;
    #fullName: string;
    #info: {[fieldName: string]: any};


    get elem(): any {
        ts0Assert(`${this.#fullName}_Field` in this.#layout.$elems, 
                `Cannot find 'elem' in field layout.`);

        return this.#layout.$elems[`${this.#fullName}_Field`];
    }

    get fullName(): string {
        return this.#fullName;
    }

    get info(): {[fieldName: string]: any} {
        return this.#info;
    }

    get value(): any {
        let type = this.#info.type;

        /* Date Time */
        if (type === 'Checkbox') {
            return this.elem.checked ? true : false;
        } else if (type === 'Date') {
            let value = this.elem.value;

            return value === '' ? null : abDate.strToTime_Date_UTC(value);
        } else if (type === 'DateTime') {
            let value = this.elem.value;

            return value === '' ? null : abDate.strToTime_DateTime_UTC(value);
        } else if (type === 'Message') {
            throw new Error('Value of Message Field is not gettable.');
        } else if (type === 'Time') {
            let value = this.elem.value;

            return value === '' ? null : abDate.strToTime_Time(value);
        } else if (type === 'File') {
            let file = this.elem.files[0];
            return typeof file === 'undefined' ? null : file;
        } else if (type === 'Text')
            return null;
        else if (type === 'Radio') {
            let options = this.#layout.$elems.$getAll(`${this.#fullName}_Field`);

            for (let i = 0; i < options.length; i++) {
                if (options[i].checked)
                    return options[i].getAttribute('value');
            }

            return '';
        } else if (type === 'SelectMultiple') {
            let values = [];

            let options = this.elem.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }

            return values;
        } else if (type === 'Input' && 
                this.#info['input-type'].toLowerCase() === 'checkbox') {
            return this.elem.checked ? true : false;
        }

        return this.elem.value;
    }
    set value(value) {
        this.clearValidator();

        if (this.#info.type === 'Checkbox') {
            this.elem.checked = value ? true : false;
            let event = new Event('change', { bubbles: true, cancelable: true });
            this.elem.dispatchEvent(event);
        } else if (this.#info.type === 'Date' || this.#info.type === 'DateTime' ||
                this.#info.type === 'Time') {
            if (value === null)
                this.elem.value = '';
            else {
                // @ts-expect-error
                let m = moment(value * 1000).utcOffset(0);
                $(this.elem).data('DateTimePicker').date(m);
            }
        } else if (this.#info.type === 'Message') {
            /* Do nothing */
        } else if (this.#info.type === 'File') {
            /* Do nothing. */
        } else if (this.#info.type === 'Radio') {
            let options = this.#layout.$elems.$getAll(`${this.#fullName}_Field`);

            for (let i = 0; i < options.length; i++) {
                if (options[i].getAttribute('value') === String(value)) {
                    options[i].checked = true;
                    return;
                }
            }
        } else if (this.#info.type === 'Input') {
            if (this.#info['input-type'].toLowerCase() === 'checkbox') {
                this.elem.checked = value ? true : false;
                let event = new Event('change', { bubbles: true, cancelable: true });
                this.elem.dispatchEvent(event);
            } else
                this.elem.value = value;
        } else if (this.#info.type === 'Select') {
            let selected = false;
            let options = this.elem.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === value + '') {
                    options[i].selected = true;

                    let event = new Event('change', { bubbles: true, cancelable: true });
                    this.elem.dispatchEvent(event);

                    selected = true;
                    break;
                }
            }

            if (!selected)
                console.warn('Cannot find option `' + value + '` for field `' +
                        this.fullName + '`.');
        } else if (this.#info.type === 'SelectMultiple') { 
            if (!(value instanceof Array)) {
                console.warn(`SelectMultiple value '` + value + `' should be an Array.`);
                return;
            }

            for (let value_T of value) {
                let selected = false;
                let options = this.elem.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].value === value_T + '') {
                        options[i].selected = true;

                        let event = new Event('change', { bubbles: true, 
                            cancelable: true });
                        this.elem.dispatchEvent(event);

                        selected = true;
                        break;
                    }
                }

                if (!selected)
                    console.warn('Cannot find option `' + value_T + '`.');
            }
        } else if (this.#info.type === 'Text')
            this.elem.innerHTML = value;
        else
            this.elem.value = value;

        // if (this.#private.valueFieldName !== null)
        //     this.#private.mForm.$fields[this.#private.valueFieldName] = this.value;
        // }
    }

    constructor(form: Form, layout: Layout, fieldInfo: {[name: string]: any}) {
        this.#form = form;
        this.#layout = layout;
        this.#info = fieldInfo;

        this.#disabled = false;

        this.#fullName = `spkForms_${fieldInfo.form}_Fields_${fieldInfo.name}`;

        let fields: {[fieldName: string]: string} = {};
        fields[`${this.#fullName}_Label`] = 'label' in this.#info ? this.#info.label : '';        

        this.init();

        this.#layout.$fields = fields;
    }

    clear(): void {
        this.value = '';
        this.clearValidator();
    }

    clearValidator(): void {
        this.#layout.$fields[`${this.#fullName}_Validator`] = {
            errors: [],
            fieldClass: '',
            divClass: '',
        }
        this.#form.clearMessage();
    }

    field(fieldName: string, value: any = ts0.notSet): any {
        if (value === ts0.notSet)
            return this.#layout.$fields[`${this.fullName}_${fieldName}`];
        else
            this.#layout.$fields[`${this.fullName}_${fieldName}`] = value;
    }

    getLayoutElem(fieldName: string): any {
        return this.#layout.$elems[`${this.#fullName}_${fieldName}`];
    }

    getLayoutField(fieldName: string): any {
        return this.#layout.$fields[`${this.#fullName}_${fieldName}`];
    }

    init(): void {
        let onChange = (evt: Event) => {
            this.clearValidator();
        };

        if (this.#info.type === 'Checkbox') {
            this.elem.addEventListener('change', onChange);
            this.elem.addEventListener('keyup', onChange);
        } else if (this.#info.type === 'Date' || this.#info.type === 'DateTime' ||
                this.#info.type === 'Time') {
            let format;
            if (this.#info.type === 'Date')
                format = abDate.formats_Date;
            else if (this.#info.type === 'DateTime')
                format = abDate.formats_DateTime;
            else if (this.#info.type === 'Time')
                format = abDate.formats_Time;

            /* Initialize `date` field. */
            $(this.elem)
                // @ts-expect-error
                .datetimepicker( {
                    format: format,
                    showTodayButton: this.#info.type !== 'Time',
                    useCurrent: false,
                    locale: spkForms.lang,
                    ignoreReadonly: true,
                })
                .on('dp.show', (evt: Event) => {
                    if($(this.elem).data("DateTimePicker").date() === null) {
                        // @ts-expect-error
                        $(this.elem).data("DateTimePicker").date(moment());
                    }
                })
                .on('dp.hide', (evt: Event) => {
                    this.elem.setAttribute('value', this.elem.value);
                    this.clearValidator();
                    this.elem.blur();
                });

            this.#layout.$elems[`${this.#fullName}_ClearCalendar`].addEventListener(
                    'click', (evt: Event) => {
                evt.preventDefault();
                if (!this.#disabled)
                    this.value = null;
            });
        } else if (this.#info.type === 'File') {
            this.field('Accept', '');
            if ('accept' in this.#info)
                this.field('Accept', this.#info.accept);
        } else if (this.#info.type === 'Input' || this.#info.type === 'TextArea') {
            // this.value = '';

            this.elem.addEventListener('change', onChange);
            this.elem.addEventListener('keyup', onChange);

            // this.elem.setAttribute('value', '');
        } else if (this.#info.type === 'Radio') {
            this.getLayoutElem('Field')((elem: Element) => {
                elem.addEventListener('change', onChange);
            });
            // this.#layout.$elems.each('field', function(elem) {
            //     elem.addEventListener('change', onChange);
            // });
        } else if (this.#info.type === 'Select' || this.#info.type === 'file') {
            this.elem.addEventListener('change', onChange);
        }
    }

    setDisabled(disabled: boolean): void {
        this.#disabled = disabled;

        let elems = this.#layout.$elems.$getAll(`${this.#fullName}_Field`);

        for (let elem of elems) {
            if (disabled)
                elem.setAttribute('disabled', '');
            else
                elem.removeAttribute('disabled');
        }
    }

    setValidator(validator: FieldValidator): void {
        this.#layout.$fields[`${this.#fullName}_Validator`] = {
            errors: 'errors' in validator ? validator.errors : [],
            fieldClass: validator.valid ? '' : 'is-invalid',
            divClass: '',
        }
    }
}