// -*- coding: utf-8 -*-

//
//    This file is part of select-object-path.
//
//    select-object-path is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    select-object-path is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with select-object-path.  If not, see <http://www.gnu.org/licenses/>
//

/**
 * select-object-path
 * @module select-object-path
 */

/**
 * @file select-object-path main file
 * @author Alban Minassian
 * @version 1.0.0
 * @license GPL-3.0
 */

(function() {

    "use strict";

    var traverse = require('traverse');
    var _ = require('underscore');
    var _s = require('underscore.string');
    var refAliasSchemaJsonFilePath = __dirname + '/../schema/ref.alias.schema.json';
    var refAliasSchemaJson = require(refAliasSchemaJsonFilePath);
    var refAddSchemaJsonFilePath = __dirname + '/../schema/ref.add.schema.json';
    var refAddSchemaJson = require(refAddSchemaJsonFilePath);
    var refNotSchemaJsonFilePath = __dirname + '/../schema/ref.not.schema.json';
    var refNotSchemaJson = require(refNotSchemaJsonFilePath);
    var refSelectSchemaJsonFilePath = __dirname + '/../schema/ref.select.schema.json';
    var refSelectSchemaJson = require(refSelectSchemaJsonFilePath);

    var inSelectFilePath = __dirname + '/../schema/select.in.schema.json';
    var inSelect = require(inSelectFilePath);
    var inSelectToPatternFilePath = __dirname + '/../schema/selectToPattern.in.schema.json';
    var inSelectToPattern = require(inSelectToPatternFilePath);
    var JaySchema = require('jayschema');
    var jaySchema = new JaySchema();
    jaySchema.register(refAliasSchemaJson);
    jaySchema.register(refAddSchemaJson);
    jaySchema.register(refNotSchemaJson);
    jaySchema.register(refSelectSchemaJson);

    /**
     * selectToPattern
     *
     * @param {Object} options - options (schema json : schema/selectToPattern.in.schema.json )
     * @return {Array} result of pattern (schema json : schema/selectToPattern.out.schema.json )
     */
    var selectToPattern = module.exports.selectToPattern = function(options) {
        var jayresult, flag, listSelectPattern, tmpAlias, arrayPattern = [];
        var result = {patterns: [], licence: "GPL-3.0", donate: ["https://pledgie.com/campaigns/28037", "https://gratipay.com/aminassian"]};

        // validate options
        jayresult = jaySchema.validate(options, inSelectToPattern); // console.log(_options, jayresult.length);
        if (jayresult.length !== 0) {
            throw new Error(JSON.stringify(options, null, 4) + " not valid => " + JSON.stringify(jayresult, null, 4));
        }

        // trim select
        options.select = _s.trim(options.select);
        // switch first char ``-`` or ``+``
        if (_.indexOf(options.add, options.select[0]) !== -1) { // start with add char (+) : if positive then exclude previously
            options.select = "-.*," + options.select;
        } else if (_.indexOf(options.not, options.select[0]) !== -1) { // start with minus char (-) : if negative then include all Before
            options.select = "+.*," + options.select;
        }
        // switch options.select
        if (options.select !== "") {
            // split comma
            listSelectPattern = options.select.split(",");
            // each select
            _.each(listSelectPattern, function(tmpSelect) {
                if (tmpSelect !== "") { // avoid empty comma
                    // set default action
                    flag = "+";
                    // trim
                    tmpSelect = _s.trim(tmpSelect);
                    // start with add char (+) ?
                    if (_.indexOf(options.add, tmpSelect[0]) !== -1) {
                        tmpSelect = tmpSelect.slice(1); // remove first char
                        flag = "+";
                    }
                    // start with minus char (-) ?
                    if (_.indexOf(options.not, tmpSelect[0]) !== -1) {
                        tmpSelect = tmpSelect.slice(1); // remove first char
                        flag = "-";
                    }
                    // if alias
                    if (options.alias.hasOwnProperty(tmpSelect)) {
                        if (flag === "+") {
                            arrayPattern.push(options.alias[tmpSelect]);
                        } else { // if (flag === "-") {
                            // invert flag
                            tmpAlias = _.clone(options.alias[tmpSelect]);
                            if (tmpAlias.flag === '-') { tmpAlias.flag = "+"; } else { tmpAlias.flag = "-"; }
                            arrayPattern.push(tmpAlias);
                        }
                    } else { // if not alias
                        arrayPattern.push({"pattern": tmpSelect, "flag": flag});
                    }
                }
            });
            result.patterns = arrayPattern;
            return result;
        } else {
            result.patterns = [{"pattern": ".*", "flag": "+"}];
            return result;
        }
    };

    /**
     * select
     *
     * @param {Object} options - options (schema json : schema/select.in.schema.json )
     * @return {Object} result (schema json : schema/select.out.schema.json )
     */
    module.exports.select = function(options) {

        // var
        var jayresult, jsonToPath, tmpPath, objJsonPathValue, resultSelectPattern, path, tmpReg = {}, pathReg, tmpMatchPath, analyseToRow, analyseToObject, cloneObject,
        _options = {
            "add" : ["+"],
            "not": ["-", "!"],
            "object": {},
            "alias" : {"*" : {"pattern": ".*", "flag": "+"}, "all" : {"pattern": ".*", "flag": "+"}, "none" : {"pattern": ".*", "flag": "-"}},
            "select" : "*"
        },
        result = {path: [], licence: "GPL-3.0", donate: ["https://pledgie.com/campaigns/28037", "https://gratipay.com/aminassian"]};

        // options
        if (typeof options !== 'undefined') {
            if (options.hasOwnProperty('add')) {
                _options.add = options.add;
            }
            if (options.hasOwnProperty('not')) {
                _options.not = options.not;
            }
            if (options.hasOwnProperty('object')) {
                _options.object = options.object;
            }
            if (options.hasOwnProperty('alias')) {
                _options.alias = options.alias;
            }
            if (options.hasOwnProperty('select')) {
                _options.select = options.select;
            }
        }

        // validate options
        jayresult = jaySchema.validate(_options, inSelect); // console.log(_options, jayresult.length);
        if (jayresult.length !== 0) {
            throw new Error(JSON.stringify(_options, null, 4) + " not valid => " + JSON.stringify(jayresult, null, 4));
        }

        // transform _options.object to array path
        jsonToPath = [];
        cloneObject = JSON.parse(JSON.stringify(_options.object)); // <== really clone object ! cloneObject = _.clone(_options.object); <=== _.clone and this.update (traverse(cloneObject)) => update original _options.object !!!
        traverse(cloneObject).forEach(function(value, x) {
            if (this.path.length > 0) { // avoid root node
                tmpPath = "/" + (this.path).join("/");
                jsonToPath.push(tmpPath);
                // only traverse object tree key, discard traverse array
                if (value instanceof Array) {
                    this.update(null); // set value to null (in cloneObject) to not traverse array
                }
            }
        });

        // transform _options.select to regExp
        resultSelectPattern = selectToPattern({"select": _options.select, "add": _options.add, "not": _options.not, "alias": _options.alias});

        //
        path = [];
        _.each(resultSelectPattern.patterns, function(selectPattern) {

            // prepare reg exp
            if (! tmpReg.hasOwnProperty(selectPattern.pattern)) {
                pathReg = new RegExp(selectPattern.pattern, "g");
                tmpReg[selectPattern.pattern] = pathReg;
            } else {
                pathReg = tmpReg[selectPattern.pattern];
            }

            // match all regExp
            tmpMatchPath = [];
            _.each(jsonToPath, function(tmpPath) {
                if (tmpPath.match(pathReg)) {
                    tmpMatchPath.push(tmpPath);
                }
            }); // console.log(tmpMatchPath)

            // switch flag +/-
            if (selectPattern.flag == "+") {
                path = _.union(path, tmpMatchPath);
            } else { // if (selectPattern.flag == "-") {
                _.each(tmpMatchPath, function(tmpPath) {
                    path = _.without(path, tmpPath);
                });
            }

        });

        // return
        result.path = path;

        return result;

    };

}());