'use strict';

const
    spocky = require('spocky')
;

export default class Message extends spocky.Layout {

    static get Content() {
        return [["div",{"_show":["{{fullFormName}}_Message_Show"],"_data-spk-forms-message":["{{formName}}"],"class":["alert ${{fullFormName}}_Message_Class"]},"${{fullFormName}}_Message"]];
    }


    constructor()
    {
        super(Message.Content);
    }

}
