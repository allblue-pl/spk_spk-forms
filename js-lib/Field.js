'use strict';

const
    abDate = require('ab-date'),
    js0 = require('js0'),

    spkForms = require('.')
;


export default class Field
{

    get elem() {
        js0.assert(`${this._fullName}_Field` in this._layout.$elems, 
                `Cannot find 'elem' in field layout.`);

        return this._layout.$elems[`${this._fullName}_Field`];
    }

    get fullName() {
        return this._fullName;
    }

    get info() {
        return this._info;
    }

    get value() {
        let type = this._info.type;

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

            return value === '' ? null : abDate.strToTime_Time_UTC(value);
        } else if (type === 'File') {
            let file = this.elem.files[0];
            return typeof file === 'undefined' ? null : file;
        } else if (type === 'Text')
            return null;
        else if (type === 'Radio') {
            console.log('Radio not implemented.');
            // let options = this._private.$elems.htmlElems('field');

            // for (let i = 0; i < options.length; i++) {
            //     if (options[i].checked)
            //         return options[i].getAttribute('value');
            // }

            // return '';
        } else if (type === 'SelectMultiple') {
            let values = [];

            let options = this.elem.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    values.push(options[i].value);
                }
            }

            return values;
        } else if (type === 'Input' && this._info['input-type'] === 'checkbox')
            return this.elem.checked ? true : false;

        return this.elem.value;
    }
    set value(value) {
        if (this._info.type === 'Checkbox') {
            this.elem.checked = value ? true : false;
            let event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, true);
            this.elem.dispatchEvent(event);
        } else if (this._info.type === 'Date' || this._info.type === 'DateTime' ||
                this._info.type === 'Time') {
            if (value === null)
                this.elem.value = '';
            else {
                let m = moment(value * 1000).utcOffset(abDate.utcOffset);
                $(this.elem).data('DateTimePicker').date(m);
            }
        } else if (this._info.type === 'Message') {
            /* Do nothing */
        } else if (this._info.type === 'File') {
            /* Do nothing. */
        } else if (this._info.type === 'Radio') {
            let options = this._private.$elems.htmlElems('field');

            for (let i = 0; i < options.length; i++) {
                if (options[i].getAttribute('value') === value) {
                    options[i].checked = true;
                    return;
                }
            }
        } else if (this._info.type === 'Input') {
            if (this._info['input-type'] === 'checkbox') {
                this.elem.checked = value ? true : false;
                let event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, true);
                this.elem.dispatchEvent(event);
            } else
                this.elem.value = value;
        } else if (this._info.type === 'Select') {
            let selected = false;
            let options = this.elem.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === value + '') {
                    options[i].selected = true;

                    let event = document.createEvent("HTMLEvents");
                    event.initEvent("change", true, true);
                    this.elem.dispatchEvent(event);

                    selected = true;
                    break;
                }
            }

            if (!selected)
                console.warn('Cannot find option `' + value + '`.');
        } else if (this._info.type === 'SelectMultiple') { 
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

                        let event = document.createEvent("HTMLEvents");
                        event.initEvent("change", true, true);
                        this.elem.dispatchEvent(event);

                        selected = true;
                        break;
                    }
                }

                if (!selected)
                    console.warn('Cannot find option `' + value_T + '`.');
            }
        } else if (this._info.type === 'Text')
            this.elem.innerHTML = value;
        else
            this.elem.value = value;

        // if (this._private.valueFieldName !== null)
        //     this._private.mForm.$fields[this._private.valueFieldName] = this.value;
        // }
    }

    constructor(layout, fieldInfo)
    {
        this._layout = layout;
        this._info = fieldInfo;

        this._fullName = `spkForms_${fieldInfo.form}_Fields_${fieldInfo.name}`;

        let fields = {};
        fields[`${this._fullName}_Label`] = 'label' in this._info ? this._info.label : '';        

        this.init();

        this._layout.$fields = fields;
    }

    clear()
    {
        this.value = '';
        this.clearValidator();
    }

    clearValidator()
    {
        this._layout.$fields[`${this._fullName}_Validator`] = {
            errors: [],
            fieldClass: '',
            divClass: '',
        }
    }

    field(fieldName, ...args)
    {
        if (args.length === 0)
            return this._layout.$fields[`${this.fullName}_${fieldName}`];
        else
            this._layout.$fields[`${this.fullName}_${fieldName}`] = args[0];
    }

    init()
    {
        let onChange = (evt) => {
            this.clearValidator();
        };

        if (this._info.type === 'Checkbox') {
            this.elem.addEventListener('change', onChange);
            this.elem.addEventListener('keyup', onChange);
        } else if (this._info.type === 'Date' || this._info.type === 'DateTime' ||
                this._info.type === 'Time') {
            let format;
            if (this._info.type === 'Date')
                format = abDate.formats_Date;
            else if (this._info.type === 'DateTime')
                format = abDate.formats_DateTime;
            else if (this._info.type === 'Time')
                format = abDate.formats_Time;

            /* Initialize `date` field. */
            $(this.elem)
                .datetimepicker( {
                    format: format,
                    showTodayButton: this._info.type !== 'Time',
                    useCurrent: false,
                    locale: spkForms.lang,
                    ignoreReadonly: true,
                })
                .on('dp.show', (evt) => {
                    if($(this.elem).data("DateTimePicker").date() === null)
                        $(this.elem).data("DateTimePicker").date(moment());
                })
                .on('dp.hide', (evt) => {
                    this.elem.setAttribute('value', this.elem.value);
                    this.clearValidator();
                    this.elem.blur();
                });

            this._layout.$elems[`${this._fullName}_ClearCalendar`].addEventListener(
                    'click', (evt) => {
                evt.preventDefault();
                this.value = null;
            });
        } else if (this._info.type === 'file') {
            this.fields.accept = '';
            if (this.attrExists('accept'))
                this.fields.accept = this.getAttr('accept');
        } else if (this._info.type === 'radio') {
            this.$elems.each('field', function(elem) {
                elem.addEventListener('change', on_change);
            });
        } else if (this._info.type === 'select' || this._info.type === 'file') {
            this.elem.addEventListener('change', on_change);
        } else if (this._info.type === 'Input' || this._info.type === 'TextArea') {
            this.value = '';

            this.elem.addEventListener('change', onChange);
            this.elem.addEventListener('keyup', onChange);

            // this.elem.setAttribute('value', '');
        }
    }

    setDisabled(disabled)
    {
        js0.args(arguments, 'boolean');

        if (disabled)
            this.elem.setAttribute('disabled', '');
        else
            this.elem.removeAttribute('disabled');
    }

    setValidator(validator)
    {
        this._layout.$fields[`${this._fullName}_Validator`] = {
            errors: 'errors' in validator ? validator.errors : [],
            fieldClass: validator.valid ? '' : 'is-invalid',
            divClass: '',
        }
    }

}