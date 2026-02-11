
const testCases = [
    "*===WEBSITE - Region ===*",
    "=== WEBSITE - GLOBAL ===",
    "=== WEBSITE - REGION ==="
];

const content = "\n\nThree rooms, one stay...";
const regex = /\*?={3,}\s*WEBSITE\s*-\s*.*?\s*={3,}\*?/gi;

testCases.forEach(header => {
    const input = header + content;
    const output = input.replace(regex, '').trim();
    console.log(`Input: "${header}"`);
    console.log(`Output: "${output}"`);
    if (output === "Three rooms, one stay...") {
        console.log("MATCH: Success\n");
    } else {
        console.log("MATCH: Failed\n");
    }
});
