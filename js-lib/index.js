'use strict';

const
    js0 = require('js0'),
    spocky = require('spocky'),

    $layouts = require('./$layouts')
;

class spkForms_Class
{

    get Ext() {
        return require('./Ext');
    }

    get Field() {
        return require('./Field');
    }

    get Form() {
        return require('./Form');
    }


    get debug() {
        return this._debug;
    }

    get lang() {
        return this._lang;
    }

    constructor()
    {
        this.extInitialized = false;
    }

    setDebug(debug)
    {
        js0.args(arguments, 'boolean');

        this._debug = debug;
    }

    setLang(lang)
    {
        js0.args(arguments, 'string');

        this._lang = lang;
    }

}
export default spkForms = new spkForms_Class();