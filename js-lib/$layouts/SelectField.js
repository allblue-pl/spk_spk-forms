'use strict';

const
    spocky = require('spocky')
;

export default class SelectField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group ${{fullFieldName}}.divClass ${{rowClass}} {{fullFieldName}}_Validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fullFieldName}}"],"class":["{{labelClass}}}"]},"{{fieldLabel}}"],["div",{"class":["{{fieldClass}}"]},["select",{"_elem":["{{fullFieldName}}_Field"],"type":["{{inputType}}"],"id":["{{fullFieldName}}"],"name":["{{fieldName}}"],"class":["form-control"],"style":["${{fullFieldName}}_Style"]},["option",{"_repeat":["{{fullFieldName}}_Options:option"],"_field":["option.title"],"value":["$option.value"],"class":["$option.class"],"style":["$option.style"]}]],["p",{"_repeat":["{{fullFieldName}}_Validator.errors:errorMessage"],"class":["error"]},"$errorMessage"]]]];
    }


    constructor()
    {
        super(SelectField.Content);
    }

}
