'use strict';

const
    spocky = require('spocky')
;

export default class SelectField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group {{field.divClass}} {{validator.divClass}}"]},["label",{"ab-show":["field.label"],"for":["{{field.name}}"],"class":["{{field.labelClass}}"]},"{{field.label}}"],["div",{"class":["{{field.fieldClass}}"]},["select",{"ab-elem":["field(field)"],"id":["{{field.name}}"],"name":["{{field.name}}"],"class":["form-control"]},["option",{"ab-repeat":["field.options:option"],"value":["{{option.value}}"]},"{{option.title}}"]],["p",{"ab-show":["validator.hasErrors"],"ab-repeat":["validator.errors:error_message"],"class":["error"]},"{{error_message}}"]]]];
    }


    constructor()
    {
        super(SelectField.Content);
    }

}
