'use strict';

const
    spocky = require('spocky')
;

export default class InputField extends spocky.Layout {

    static get Content() {
        return [["div",{"class":["form-group ${{fullFieldName}}.divClass ","$validator.divClass"],"_data-spk-field":["{{formName}}:{{fieldInfo}}"]},["label",{"_show":["{{fullFieldName}}_Label"],"for":["{{fieldName}}"],"class":["${{fullFieldName}}_LabelClass"]},"${{fieldLabel}}"],["div",{"class":["${{fullFieldName}}_FieldClass"]},["input",{"_elem":["${{fullFieldName}}.field"],"type":["{{inputType}}"],"id":["{{fieldName}}"],"name":["{{fieldName}}"],"class":["form-control"],"placeholder":["${{fullFieldName}}.placeholder"]}],["p",{"_show":["validator.hasErrors"],"_repeat":["validator.errors:errorMessage"],"class":["error"]},"{{errorMessage}}"]]]];
    }


    constructor()
    {
        super(InputField.Content);
    }

}
