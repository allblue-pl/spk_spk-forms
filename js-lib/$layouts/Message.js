'use strict';

const
    spocky = require('spocky')
;

export default class Message extends spocky.Layout {

    static get Content() {
        return [];
    }


    constructor()
    {
        super(Message.Content);
    }

}
