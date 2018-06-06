'use strict';

const
    spocky = require('spocky')
;

export default class DateField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group {{field.divClass}} {{validator.divClass}}"]},["label",{"ab-show":["field.label"],"for":["{{field.name}}"],"class":["{{field.labelClass}}"]},"{{field.label}}"],["div",{"class":["{{field.fieldClass}}"]},["div",{"class":["input-group"]},["input",{"ab-elem":["field(field)"],"type":["text"],"id":["{{field.id}}"],"name":["{{field.name}}"],"class":["form-control datetimepicker"],"placeholder":["{{field.placeholder}}"]}],["span",{"class":["input-group-addon"]},["span",{"ab-elem":["calendar"],"class":["fa fa-calendar"]}]]],["p",{"ab-show":["validator.hasErrors"],"ab-repeat":["validator.errors:error_message"],"class":["error"]},"{{error_message}}"]]]];
    }


    constructor()
    {
        super(DateField.Content);
    }

}
