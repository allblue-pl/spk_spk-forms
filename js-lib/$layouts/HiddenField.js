'use strict';

const
    spocky = require('spocky')
;

export default class HiddenField extends spocky.Layout {

    constructor()
    {
        super([["input",{"ab-elem":["field(field)"],"type":["hidden"],"id":["{{field.name}}"],"name":["{{field.name}}"],"class":["form-control"],"placeholder":["{{field.placeholder}}"]}]]);
    }

}
