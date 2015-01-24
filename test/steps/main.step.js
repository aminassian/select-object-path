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

(function() {

    "use strict";

    var outSelectFilePath = __dirname + '/../../schema/select.out.schema.json';
    var outSelect = require(outSelectFilePath);
    var inSelectFilePath = __dirname + '/../../schema/select.in.schema.json';
    var inSelect = require(inSelectFilePath);
    var outSelectToPatternFilePath = __dirname + '/../../schema/selectToPattern.out.schema.json';
    var outSelectToPattern = require(outSelectToPatternFilePath);
    var inSelectToPatternFilePath = __dirname + '/../../schema/selectToPattern.in.schema.json';
    var inSelectToPattern = require(inSelectToPatternFilePath);
    var refAliasSchemaJsonFilePath = __dirname + '/../../schema/ref.alias.schema.json';
    var refAliasSchemaJson = require(refAliasSchemaJsonFilePath);
    var refAddSchemaJsonFilePath = __dirname + '/../../schema/ref.add.schema.json';
    var refAddSchemaJson = require(refAddSchemaJsonFilePath);
    var refNotSchemaJsonFilePath = __dirname + '/../../schema/ref.not.schema.json';
    var refNotSchemaJson = require(refNotSchemaJsonFilePath);
    var refSelectSchemaJsonFilePath = __dirname + '/../../schema/ref.select.schema.json';
    var refSelectSchemaJson = require(refSelectSchemaJsonFilePath);

    var English = require('yadda').localisation.English;
    var sop = require('../../lib/main');
    var expect = require('chai').expect;
    var JaySchema = require('jayschema');
    var jaySchema = new JaySchema();
    jaySchema.register(refAliasSchemaJson);
    jaySchema.register(refAddSchemaJson);
    jaySchema.register(refNotSchemaJson);
    jaySchema.register(refSelectSchemaJson);

    var callResult, options, result, eot, eotToJson, strToEval, jayresult, error, select, catchError;

    module.exports = (function() {
        return English.library()
            .given("new options (.*)", function(options, next) {
                options = JSON.parse(options);
                next();
            })
            .define("Given new options <<<EOT", function(next) {
                strToEval = 'options = eotToJson;';
                eot = [];
                next();
            })
            .define("Then sop.select return <<<EOT", function(next) {
                strToEval = 'expect(result).deep.equal(eotToJson);';
                eot = [];
                next();
            })
            .define("Then sop.selectToPattern return <<<EOT", function(next) {
                strToEval = 'expect(result).deep.equal(eotToJson);';
                eot = [];
                next();
            })
            .define("EOT;", function(next) {
                try {
                    eotToJson = JSON.parse(eot.join("\n")); // console.log(strToEval, eot, eotToJson, result)
                    eval(strToEval); // evil but good :-)
                    next();
                } catch (e) {
                    next(e);
                }
            })
            .define("and result is validate select.out.schema.json", function(next) {
                jayresult = jaySchema.validate(eotToJson, outSelect);
                if (jayresult.length !== 0) {
                    error = new Error("select.out.schema.json => " + JSON.stringify(eotToJson, null, 4));
                    next(error);
                } else {
                    next();
                }
            })
            .define("and result is validate selectToPattern.out.schema.json", function(next) {
                jayresult = jaySchema.validate(eotToJson, outSelectToPattern);
                if (jayresult.length !== 0) {
                    error = new Error("selectToPattern.out.schema.json => " + JSON.stringify(eotToJson, null, 4));
                    next(error);
                } else {
                    next();
                }
            })
            .define("(?:and|Then) select.in.schema.json validate options", function(next) {
                jayresult = jaySchema.validate(options, inSelect);
                if (jayresult.length !== 0) {
                    error = new Error("select.in.schema.json => " + JSON.stringify(jayresult, null, 4) + " => " + JSON.stringify(options, null, 4));
                    next(error);
                } else {
                    next();
                }
            })
            .define("(?:and|Then) select.in.schema.json not validate options", function(next) {
                jayresult = jaySchema.validate(options, inSelect);
                if (jayresult.length > 0) {
                    next();
                } else {
                    error = new Error("options must not be valid !");
                    next(error);
                }
            })
            .when("i call sop.select with options", function(next) {
                try {
                    result = sop.select(options);
                    next();
                } catch (err) {
                    catchError = err;
                    next();
                }
            })
            .when("i call sop.select without options", function(next) {
                result = sop.select();
                next();
            })
            .given("argument sop.selectToPattern (.*)", function(argOptions, next) {
                options = JSON.parse(argOptions);
                next();
            })
            .define("and sop.selectToPattern is validate selectToPattern.in.schema.json", function(next) {
                jayresult = jaySchema.validate(options, inSelectToPattern);
                if (jayresult.length !== 0) {
                    error = new Error("selectToPattern.in.schema.json => " + JSON.stringify(jayresult, null, 4) + " => " + JSON.stringify(options, null, 4));
                    next(error);
                } else {
                    next();
                }
            })
            .when("i call sop.selectToPattern with argument", function(next) {
                try {
                    result = sop.selectToPattern(options);
                    next();
                } catch (err) {
                    catchError = err;
                    next();
                }
            })
            .then("throw an error", function(next) {
                expect (function() { throw catchError }).to.throw (Error, /not valid/);
                next();
            })
            .define("(.*)", function(str, next) {
                eot.push(str)
                next();
            })
    })();

}());