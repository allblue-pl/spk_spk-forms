'use strict';


export default class Field
{

    get elem() {
        return this._layout.$elems[`${this._fullName}_Field`];
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
        } else if (type === 'input' && this._info['input-type'] === 'checkbox')
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
        } else if (this._info.type === 'input') {
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

        this._layout.$fields = lFields;
    }

}