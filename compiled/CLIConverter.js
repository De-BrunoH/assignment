"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIConvertor = void 0;
const readlineSync = require('readline-sync');
const fs = require('fs');
class CLIConvertor {
    constructor(targetJsonFile) {
        this.targetJsonPath = targetJsonFile;
    }
    run() {
        this.clearOutputFile();
        this.displayAppStartInstructions();
        this.userInputLoop();
    }
    clearOutputFile() {
        fs.writeFileSync(this.targetJsonPath, "[]", "utf8");
    }
    displayAppStartInstructions() {
        console.log("App start.\n" +
            "For exit execute: \'^C\'\n" +
            "Input string should consist of only alphanumeric characters.\n");
    }
    userInputLoop() {
        while (true) {
            let input = readlineSync.question('Input:   ').trim();
            this.processUserInput(input);
        }
    }
    processUserInput(input) {
        let startTime = performance.now();
        if (!this.hasCorrectFormat(input)) {
            console.log("Input string should consist of only alphanumeric characters. Try again.\n");
        }
        else {
            let transformed = this.transformString(input);
            let endTime = performance.now();
            console.log("Output:  " + transformed + '\n');
            this.appendToJson({ "input": input, "output": transformed, "duration": endTime - startTime });
        }
    }
    appendToJson(newData) {
        let jsonContents;
        let data = fs.readFileSync(this.targetJsonPath, "utf8");
        jsonContents = JSON.parse(data);
        jsonContents.push(newData);
        let json = JSON.stringify(jsonContents);
        fs.writeFileSync(this.targetJsonPath, json, "utf8");
    }
    transformString(input) {
        return input.split("").reverse().map(this.transformChar).join("");
    }
    transformChar(input) {
        return (input.toLowerCase() == input) ? input.toUpperCase() : input.toLowerCase();
    }
    hasCorrectFormat(input) {
        return /^[a-z0-9]*$/i.test(input);
    }
}
exports.CLIConvertor = CLIConvertor;
