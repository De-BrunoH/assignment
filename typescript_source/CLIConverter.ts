declare function require(name:string):any;

const readlineSync = require('readline-sync');
const fs = require('fs');

export class CLIConvertor {
    targetJsonPath: string;

    constructor(targetJsonFile: string) {
        this.targetJsonPath = targetJsonFile;
    }

    run(): void {
        this.clearOutputFile();
        this.displayAppStartInstructions();
        this.userInputLoop();
    }

    clearOutputFile(): void {
        fs.writeFileSync(this.targetJsonPath, "[]", "utf8");
    }

    displayAppStartInstructions(): void {
        console.log("App start.\n" + 
                    "For exit execute: \'^C\'\n" +
                    "Input string should consist of only alphanumeric characters.\n");
    }

    userInputLoop(): void {
        while (true) {
            let input: string = readlineSync.question('Input:   ').trim();
            this.processUserInput(input);
        }
    }

    processUserInput(input: string): void {
        let startTime: number = performance.now();
        if (! this.hasCorrectFormat(input)) {
            console.log("Input string should consist of only alphanumeric characters. Try again.\n");
        } else {
            let transformed: string = this.transformString(input);
            let endTime: number = performance.now();
            console.log("Output:  " + transformed + '\n');
            this.appendToJson({"input": input, "output": transformed, "duration": endTime - startTime});
        } 
    }

    appendToJson(newData: Object): void {
        let jsonContents: Object[];
        let data: string = fs.readFileSync(this.targetJsonPath, "utf8");
        jsonContents = JSON.parse(data);
        jsonContents.push(newData);
        let json: string = JSON.stringify(jsonContents);
        fs.writeFileSync(this.targetJsonPath, json, "utf8");
    }

    transformString(input: string): string {
        return input.split("").reverse().map(this.transformChar).join("");
    }
    
    transformChar(input: string): string {
        return (input.toLowerCase() == input) ? input.toUpperCase() : input.toLowerCase();
    }
    
    hasCorrectFormat(input: string): boolean {
        return /^[a-z0-9]*$/i.test(input); 
    }
}
