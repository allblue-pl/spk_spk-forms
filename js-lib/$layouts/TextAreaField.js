'use strict';

const
    spocky = require('spocky')
;

export default class TextAreaField extends spocky.Layout {

    constructor()
    {
        super([["div",{"class":["form-group {{field.divClass}} {{validator.divClass}}"]},["label",{"ab-show":["field.label"],"for":["{{field.name}}"],"class":["{{field.labelClass}}"]},"{{field.label}}"],["div",{"class":["{{field.fieldClass}}"]},["textarea",{"ab-elem":["field(field)"],"placeholder":["{{field.placeholder}}"],"name":["{{field.name}}"],"id":["{{field.name}}"],"class":["form-control"],"rows":["3"]}],["p",{"ab-show":["validator.hasErrors"],"ab-repeat":["validator.errors:error_message"],"class":["error"]},"{{error_message}}"]]]]);
    }

}
