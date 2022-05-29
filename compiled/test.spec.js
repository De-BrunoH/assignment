"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLIConverter_1 = require("./CLIConverter");
const assert = require("chai").assert;
const fs = require("fs");
let convertor = new CLIConverter_1.CLIConvertor("./tests/test.json");
describe("User input format check", function () {
    it("should accept empty string", function () {
        assert.equal(convertor.hasCorrectFormat(""), true, 'empty string');
    });
    it("should accept alphanumeric strings", function () {
        assert.equal(convertor.hasCorrectFormat("a"), true, '\"a\"');
        assert.equal(convertor.hasCorrectFormat("B"), true, '\"B\"');
        assert.equal(convertor.hasCorrectFormat("4"), true, '\"4\"');
        assert.equal(convertor.hasCorrectFormat("adacta"), true, '\"adacta\"');
        assert.equal(convertor.hasCorrectFormat("ADACTA"), true, '\"ADACTA\"');
        assert.equal(convertor.hasCorrectFormat("AdAcTa"), true, '\"AdAcTa\"');
        assert.equal(convertor.hasCorrectFormat("A2d0a2C2Ta"), true, '\"A2d0a2C2Ta\"');
    });
    it("should reject non-alphanumeric strings", function () {
        assert.equal(convertor.hasCorrectFormat("?"), false, '\"?\"');
        assert.equal(convertor.hasCorrectFormat("?!:"), false, '\"?!:\"');
        assert.equal(convertor.hasCorrectFormat("B."), false, '\"B.\"');
        assert.equal(convertor.hasCorrectFormat(",4"), false, '\",4\"');
        assert.equal(convertor.hasCorrectFormat("a/dacta"), false, '\"a/dacta\"');
        assert.equal(convertor.hasCorrectFormat("ADACT|A"), false, '\"ADACT|A\"');
        assert.equal(convertor.hasCorrectFormat(">AdAcTa"), false, '\">AdAcTa\"');
        assert.equal(convertor.hasCorrectFormat("A2d0a2C2Ta<"), false, '\"A2d0a2C2Ta<\"');
        assert.equal(convertor.hasCorrectFormat("A2d|}0{a(2C2Ta"), false, '\"A2d|}0{a(2C2Ta\"');
    });
});
describe("Letters transform check: lowercase to uppercase, uppercase to lowercase", function () {
    it("random letters", function () {
        assert.equal(convertor.transformString("a"), "A", '"a" => "A"');
        assert.equal(convertor.transformString("H"), "h", '"H" => "h"');
        assert.equal(convertor.transformString("m"), "M", '"m" => "M"');
        assert.equal(convertor.transformString("X"), "x", '"X" => "x"');
    });
});
describe("String transform check: reverse string, lowercase to uppercase, uppercase to lowercase, numbers not changed", function () {
    it("empty string", function () {
        assert.equal(convertor.transformString(""), "", '"" => ""');
    });
    it("all numbers", function () {
        assert.equal(convertor.transformString("5"), "5", '"5" => "5"');
        assert.equal(convertor.transformString("53327"), "72335", '"53327" => "72335"');
        assert.equal(convertor.transformString("8752927635"), "5367292578", '"8752927635" => "5367292578"');
    });
    it("all lowercase", function () {
        assert.equal(convertor.transformString("g"), "G", '"g" => "G"');
        assert.equal(convertor.transformString("qwertyu"), "UYTREWQ", '"qwertyu" => "UYTREWQ"');
        assert.equal(convertor.transformString("asdfghjklzxcv"), "VCXZLKJHGFDSA", '"asdfghjklzxcv" => "VCXZLKJHGFDSA"');
    });
    it("all uppercase", function () {
        assert.equal(convertor.transformString("H"), "h", '"H" => "h"');
        assert.equal(convertor.transformString("ZXCVBNM"), "mnbvcxz", '"ZXCVBNM" => "mnbvcxz"');
        assert.equal(convertor.transformString("ASDFGHJKLZXCV"), "vcxzlkjhgfdsa", '"ASDFGHJKLZXCV" => "vcxzlkjhgfdsa"');
    });
    it("mixed uppercase and lowercase", function () {
        assert.equal(convertor.transformString("aDffAkOO"), "ooKaFFdA", '"aDffAkOO" => "ooKaFFdA"');
        assert.equal(convertor.transformString("ljGNbVfdREuimjHSy"), "YshJMIUerDFvBngJL", '"ljGNbVfdREuimjHSy" => "YshJMIUerDFvBngJL"');
    });
    it("mixed uppercase, lowercase, and numbers", function () {
        assert.equal(convertor.transformString("aDf3fAkO2O0"), "0o2oKaF3FdA", '"aDf3fAkO2O0" => "0o2oKaF3FdA"');
        assert.equal(convertor.transformString("ljG443NbVfdRE65uimjH78Sy"), "Ys87hJMIU56erDFvBn344gJL", '"ljG443NbVfdRE65uimjH78Sy" => "Ys87hJMIU56erDFvBn344gJL"');
    });
});
describe("Check appended data in the json output file", function () {
    it("multiple appends", function () {
        let convertorTestBlock2 = new CLIConverter_1.CLIConvertor("./tests/testoutput.json");
        convertorTestBlock2.clearOutputFile();
        convertorTestBlock2.appendToJson({ "input": "Bruno1999", "output": "9991ONURb", "duration": 10 });
        convertorTestBlock2.appendToJson({ "input": "1999", "output": "9991", "duration": 1 });
        let jsonOutput = fs.readFileSync(convertorTestBlock2.targetJsonPath, "utf8");
        let jsonParsed = JSON.parse(jsonOutput);
        assert.equal(jsonParsed.length, 2);
        assert.equal(Object.keys(jsonParsed[0]).length, 3, "not 3 keys in json");
        assert.equal(jsonParsed[0].input, "Bruno1999", "incorrect input key value");
        assert.equal(jsonParsed[0].output, "9991ONURb", "incorrect output key value");
        assert.equal(jsonParsed[0].duration, 10, "duration not inside json");
        assert.equal(Object.keys(jsonParsed[1]).length, 3, "not 3 keys in json");
        assert.equal(jsonParsed[1].input, "1999", "incorrect input key value");
        assert.equal(jsonParsed[1].output, "9991", "incorrect output key value");
        assert.equal(jsonParsed[1].duration, 1, "duration not inside json");
    });
});
describe("Application 3 iteration", function () {
    let convertorTestBlock3 = new CLIConverter_1.CLIConvertor("./tests/testoutput2.json");
    convertorTestBlock3.clearOutputFile();
    convertorTestBlock3.processUserInput("Bruno1999");
    convertorTestBlock3.processUserInput("1999");
    convertorTestBlock3.processUserInput("Bruno");
    it("check output file (ommiting duration)", function () {
        let jsonOutput = fs.readFileSync(convertorTestBlock3.targetJsonPath, "utf8");
        let jsonParsed = JSON.parse(jsonOutput);
        assert.equal(jsonParsed.length, 3);
        assert.equal(Object.keys(jsonParsed[0]).length, 3, "not 3 keys in json");
        assert.equal(jsonParsed[0].input, "Bruno1999", "incorrect input key value");
        assert.equal(jsonParsed[0].output, "9991ONURb", "incorrect output key value");
        assert.equal("duration" in jsonParsed[0], true, "duration not inside json");
        assert.equal(Object.keys(jsonParsed[1]).length, 3, "not 3 keys in json");
        assert.equal(jsonParsed[1].input, "1999", "incorrect input key value");
        assert.equal(jsonParsed[1].output, "9991", "incorrect output key value");
        assert.equal("duration" in jsonParsed[1], true, "duration not inside json");
        assert.equal(Object.keys(jsonParsed[2]).length, 3, "not 3 keys in json");
        assert.equal(jsonParsed[2].input, "Bruno", "incorrect input key value");
        assert.equal(jsonParsed[2].output, "ONURb", "incorrect output key value");
        assert.equal("duration" in jsonParsed[2], true, "duration not inside json");
    });
});
