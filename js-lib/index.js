'use strict';

const
    spocky = require('spocky'),

    $layouts = require('./$layouts')
;

export const Ext = require('./Ext');
export const Field = require('./Field');
export const Form = require('./Form');

export let debug = false;
export function setDebug(debug) {
    exports.debug = debug;
}

export let lang = 'en';
export function setLang(lang) {
    exports.lang = lang;
}