'use strict';


export default class Field
{

    get elem() {
        return this._layout.$elems[`${this._fullName}_Field`];
    }

    get fullName() {
        return this._fullName;
    }

    get value() {
        var type = this._info.type;

        /* Date Time */
        if (type === 'date') {
            var value = this.elem.value;

            return value === '' ? null : SPK.$abDate.date_StrToTime(value);
        } else if (type === 'dateTime') {
            var value = this.elem.value;

            return value === '' ? null : SPK.$abDate.dateTime_StrToTime(value);
        } else if (type === 'time') {
            var value = this.elem.value;

            return value === '' ? null : SPK.$abDate.time_StrToTime(value);
        } else if (type === 'file') {
            var file = this.elem.files[0];
            return typeof file === 'undefined' ? null : file;
        } else if (type === 'text')
            return null;
        else if (type === 'radio') {
            console.log('Radio not implemented.');
            // var options = this._private.$elems.htmlElems('field');

            // for (var i = 0; i < options.length; i++) {
            //     if (options[i].checked)
            //         return options[i].getAttribute('value');
            // }

            // return '';
        } else if (type === 'Input' && this._info['input-type'] === 'checkbox')
            return this.elem.checked ? 1 : 0;

        return this.elem.value;
    }
    set value(value) {
        if (value === null)
            value = '';

        value = value + '';

        if (this._info.type === 'date' || this._info.type === 'dateTime' ||
                this._info.type === 'time') {
            var m = value === '' ? '' : moment(value * 1000)
                    .utcOffset(SPK.$abDate.utcOffset);
            $(this.elem).data('DateTimePicker').date(m);
        } else if (this._info.type === 'file') {
            /* Do nothing. */
        } else if (this._info.type === 'radio') {
            var options = this._private.$elems.htmlElems('field');

            for (var i = 0; i < options.length; i++) {
                if (options[i].getAttribute('value') === value) {
                    options[i].checked = true;
                    return;
                }
            }
        } else if (this._info.type === 'Input') {
            if (this._info['input-type'] === 'checkbox')
                this.elem.checked = value === 'true';
            else
                this.elem.value = value;
        } else if (this._info.type === 'select') {
            var elem = this.elem;

            var selected = false;
            for (var i = 0; i < elem.options.length; i++) {
                if (elem.options[i].value === value + '') {
                    elem.options[i].selected = true;
                    selected = true;
                    break;
                }
            }

            if (!selected)
                console.warn('Cannot find option `' + value + '`.');
        } else if (this._info.type === 'text')
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

        this._fullName = `spkForms_${fieldInfo.form}_${fieldInfo.name}`;

        let lFields = {};
        lFields[`${this._fullName}_Label`] = 'label' in this._info ? this._info.label : '';        

        this.init();

        this._layout.$fields = lFields;
    }

    clearValidator()
    {
        this._layout.$fields[`${this._fullName}_Validator`] = {
            errors: [],
            divClass: '',
        }
    }

    init()
    {
        var onChange = (evt) => {
            this.clearValidator();
        };

        if (this._info.type === 'date' || this._info.type === 'dateTime' ||
                this._info.type === 'time') {
            var format;
            if (this._info.type === 'date')
                format = SPK.$eText.get('SPK:date_Format');
            else if (this._info.type === 'dateTime')
                format = SPK.$eText.get('SPK:dateTime_Format');
            else if (this._info.type === 'time')
                format = SPK.$eText.get('SPK:time_Format');

            /* Initialize `date` field. */
            $(this.elem)
                .datetimepicker( {
                    format: format,
                    showTodayButton: this._info.type !== 'time',
                    useCurrent: false,
                    locale: SPK.$eLang.tag.substring(0, 2)
                })
                .on('dp.show', function(evt) {
                    if($(this).data("DateTimePicker").date() === null)
                        $(this).data("DateTimePicker").date(moment());
                })
                .on('dp.hide', function(evt) {
                    this.elem.setAttribute('value', this.value);
                    this.clearValidator();
                    this.blur();
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
            this.elem.addEventListener('change', onChange);
            this.elem.addEventListener('keyup', onChange);

            // this.elem.setAttribute('value', '');
        }
    }

    setValidator(validator)
    {
        this._layout.$fields[`${this._fullName}_Validator`] = {
            errors: 'errors' in validator ? validator.errors : [],
            divClass: validator.state === 'error' ?
                    'has-error' : '',
        }
    }

}