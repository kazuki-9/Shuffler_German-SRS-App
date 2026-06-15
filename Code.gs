/** SRS MASTER SCRIPT*/

const UI_INDEX = 0; // Index 1 (second tab)
const DATA_INDEX = 1; // Index 0 (First tab)
const DATA_INDEX_2 = 2; // for the 2nd target-language to learn 

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheets = ss.getSheets();
const dataSheet = sheets[DATA_INDEX];
const uiSheet = sheets[UI_INDEX];


/** Column Mapping for DATA sheet */
const COL_de = 2;
const COL_exDe = 6;     // Column
const COL_exEn = 7;     // Column
const COL_LAST_REV = 13; // Column 
const COL_COUNT = 14;    // Column 
const COL_OFFSET = 15;   // Column 
const COL_PRIO = 16;     // Column 
const COL_type = 4; // Col D

/** on the UI sheet */
const cardNumberCell = "D2";
const currentRow = uiSheet.getRange(cardNumberCell).getValue(); 
const ModeToggleRow = 16;
const ModeToggleCol = 1;
const shuffleSwitchRow = 14;
const genderSwitchRow = 16;
const genderSwitchCol = 3;
const exampleEnSwitchRow = 16;
const revealSwitchRow = 18;
const hintRow = 14;
const hintCol = 3;

const dailyCounterCell = "B14";
const dailyCountRange = uiSheet.getRange(dailyCounterCell);
const dailyCount = uiSheet.getRange(dailyCounterCell).getValue(); 

/**
  Picks a new card based on the highest priority scores.
  (Primary function)
 */

function shuffleResult() {
  const lastRow = dataSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert("Data sheet is empty!");
    return;
  }

  const targetType = uiSheet.getRange("A16").getValue();
  console.log("DEBUG: Target Type is: " + targetType);
  const lastType = uiSheet.getRange("Q2").getValue();

  const priorities = dataSheet.getRange(2, COL_PRIO, lastRow - 1).getValues();
  const types = dataSheet.getRange(2, COL_type, lastRow - 1).getValues(); // column D

  let list = []; // Get an empty basket ready to hold the winners
  for (let i = 0; i < priorities.length; i++) { // Start walking down the list, checking one item at a time
    let pValue = priorities[i][0]; // Grab the priority number for the item we are looking at right now
    let typeValue = types[i][0]; // Grab the name, clean up any messy spaces, and make it all small letters
    // --- NEW: Check if it's a number AND matches your "word" vs "sentence" filter ---
    if (pValue !== "" && !isNaN(pValue) && typeValue === targetType) { // The Security Guard: Is it not empty? Is it a real number? And is it the specific type we want?
      list.push({ row: i + 2, val: pValue }); // If it passed the test, save its row number and score into our basket!
    }
  }

// Warning / Gate keeper
  if (list.length === 0) {
    let sampleType = types[0] ? types[0][0] : "Empty";
    SpreadsheetApp.getUi().alert(
      "ERROR: No matches found.\n\n" +
      "1. Script is looking for: '" + targetType + "'\n" +
      "2. First row in Data (Col I) actually has: '" + sampleType + "'\n" +
      "3. Ensure Column I contains exactly 'word' or 'sentence'."
    );
    return;
  }

  // Sort by highest priority and pick from top 5 for variety
  list.sort((a, b) => b.val - a.val); // Line them up! Put the ones with the biggest numbers at the very front of the line.
  const topPool = list.slice(0, 5); // Take only the first 5 people in line (the best ones) and put them in a special VIP group.
  const winner = topPool[Math.floor(Math.random() * topPool.length)]; // Close your eyes, reach into the VIP group, and pick one lucky winner at random!

  // Update UI hidden cells
  uiSheet.getRange("D2:G2").setValues([[winner.row, false, false, false]]);
  uiSheet.getRangeList(["E2", "H2", "I2"]).clearContent(); // This turns off Reveal (E2), turns off Hint (H2), and wipes the old hint (I2)
  console.log("SUCCESS: shuffleResult ran to the end for Row: " + winner.row);
  switchOff();
}

/**
 * Reveals the Target language sentence on the UI.
 */
function revealAnswer() {
  uiSheet.getRange("E2").setValue(true);
}

/**
 * Updates the data and triggers the next shuffle.
 */
function updateValue(points) {
  if (!currentRow) return;

  // 1. Update Last Review Date (E)
  dataSheet.getRange(currentRow, COL_LAST_REV).setValue(new Date());

  // 2. Increment Times Studied (F)
  const currentCount = dataSheet.getRange(currentRow, COL_COUNT).getValue() || 0;
  dataSheet.getRange(currentRow, COL_COUNT).setValue(currentCount + 1);

  // 3. Add points to Manual Offset (G)
  const currentOffset = dataSheet.getRange(currentRow, COL_OFFSET).getValue() || 0;
  dataSheet.getRange(currentRow, COL_OFFSET).setValue(currentOffset + points);

  // 4. Move to next card
  shuffleResult();
}

// Button Triggers
function btn_Easy() { updateValue(-15); }
function btn_Good() { updateValue(-5); }
function btn_Hard() { updateValue(5); }
function btn_Impossible() { updateValue(15); }

// my own edition: add a button to give hints
function showGender() {
  uiSheet.getRange("F2").setValue(true);
}

// my own edition: add a button to give hints 2 (example sentence)
function showExample() {
  uiSheet.getRange("G2").setValue(true);
}

// 1/21: new function for toggling multiple switches unticked
function switchOff() {
  uiSheet.getRangeList(["C16", "D16", "D18", "C14"]).setValue(false); // better than repeating getRange() 3 times
}

// 1/23
/**
 * Takes a string and replaces random words with underscores.
 * @param {string} text - The original sentence.
 * @param {number} difficulty - Chance of hiding a word (0.4 = 40%).
 */
function showHint() {
  const currentRow = uiSheet.getRange(cardNumberCell).getValue(); 
  if (!currentRow) return;

  // 1. READ the checkbox value (is it checked or not?)
  const CurrentMode = uiSheet.getRange(ModeToggleRow, ModeToggleCol).getValue();

  let hint = "";

  // 2(edit). Use the dropdown menu to decide the logic
  if (CurrentMode === "word") { // WORD MODE: Get Column B (2)
    const word = dataSheet.getRange(currentRow, COL_de).getValue().toString().trim(); // 3 = Column C
    hint = word.charAt(0) + "...";
    // console.log("DEBUG: Word hint is " + hint);
  } 
  else if (CurrentMode === "phrase"){ // PHRASE MODE: Get Column B (2)
    const phrase = dataSheet.getRange(currentRow, COL_de).getValue().toString().trim(); // 3 = Column C
    hint = phrase.charAt(0) + "...";
    // console.log("DEBUG: Phrase hint generated");
  } 
  else {  // SENTENCE MODE: Get Column C (3)
    const originalSentence = dataSheet.getRange(currentRow, COL_de).getValue();
    hint = createRandomHint(originalSentence);
    // console.log("DEBUG: Sentence hint generated");
  }

  // 3. Update the UI
  uiSheet.getRange("I2").setValue(hint);
  uiSheet.getRange("H2").setValue(true);
}

// renewed due to the updated formula in A9
function createRandomHint(text) {
  if (!text) return "";
  let words = text.split(" ");
  return words.map(word => (Math.random() < 0.6 && word.length > 3) ? "___" : word).join(" ");
}

// daily counter (3/7)
function resetOnDateChange() {
  const props = PropertiesService.getScriptProperties();      // [web:20]
  const lastDate = props.getProperty('last_run_date');        // Read the last stored run date string, e.g. "2026-03-07"
  const today = new Date(); // Get the current date and time as a Date object
  const todayKey = Utilities.formatDate(today, Session.getScriptTimeZone(), 'yyyy-MM-dd'); // Convert today's Date into a yyyy-MM-dd string in the script's time zone

  // Only run reset logic if date changed
  if (lastDate !== todayKey) {
     uiSheet.getRange(dailyCounterCell).setValue(0);
    // Update stored date
    props.setProperty('last_run_date', todayKey);
  }
}

// for Mobile
/**
 * This function runs automatically every time a cell is edited.
 * It acts as the "Mobile Button" handler.
 */
function onEdit(e) {
  const range = e.range;
  const val = range.getValue();
  const row = range.getRow();
  const col = range.getColumn();

  // A. the switch / toggle
  if (row == ModeToggleRow && col == ModeToggleCol) {
    shuffleResult();
    return;
  }

  // B. Gate Keeper: Only run if the cell was checked (TRUE)
  if (val !== true) return;
  // C. The Buttons:
  if (row == 20) {
    if (col == 1) btn_Easy();      // F20: Easy
    if (col == 2) btn_Good();      // D10: Good
    if (col == 3) btn_Hard();      // E10: Hard
    if (col == 4) btn_Impossible();// F10: Impossible    
 
    range.setValue(false); // Auto-uncheck the box so it's ready to be "clicked" again
    dailyCountRange.setValue(dailyCount + 1);
    switchOff();
  }

  // side buttons
  if (col == 4) {
    if (row == shuffleSwitchRow) {
      shuffleResult();
      range.setValue(false);
      switchOff();
    }
    if (row == exampleEnSwitchRow) showExample();
    if (row == revealSwitchRow) revealAnswer();
  }

  if (row == genderSwitchRow && col == genderSwitchCol) showGender();

  if (row == hintRow && col == hintCol) showHint();

  // self debug
  // console.log("SUCCESS: onEdit ran to the end for Row: " + winner.row);
}
