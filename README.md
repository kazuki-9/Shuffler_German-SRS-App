# Shuffler: German-SRS-App# Custom Spaced-Repetition System (SRS)
![App Demo](https://github.com/kazuki-9/german-srs-app/blob/main/Preview.gif)

*Demonstrating the "Shuffle" logic and the "Random Hint" generator.*

An ad-free, mobile-optimized language learning application built on the Google Workspace ecosystem. This tool automates vocabulary retention through custom JavaScript logic and a dynamic user interface. This is a mixture of my German study tool creation, JavaScript learning, and my hobby coding.

## Key Features
- **Smart Shuffle Engine:** A weighted randomization algorithm that prioritizes "Hard" vocabulary over mastered words.
- **Mobile-First UX:** Custom-engineered touch targets and "Button Areas" designed for one-handed thumb navigation.
- **Dynamic Cloze Deletion:** A randomized hint generator that utilizes JavaScript string manipulation to hide context-clues for enhanced recall.
- **Dual-Mode Learning:** Toggle system to switch among "Word" (vocabulary), "Phrase" (expressions with word-chunks) and "Sentence" (grammar/context) modes.
- **Automated Metadata:** Tracks study dates, priority shifts, and performance metrics automatically.

## Technical Stack
- **Language:** JavaScript (Google Apps Script)
- **Engine:** Google V8 Runtime
- **Frontend:** Google Sheets UI with Conditional Formatting
- **Data Store:** Structured Spreadsheet DB

## Logic Highlight: The Priority Engine
The core of the app uses a priority-based filtering system. Instead of simple randomization, the script evaluates the `Priority` column in DB to ensure low-confidence items appear more frequently, simulating professional SRS software like Anki.

## Preview
<img width="414" height="726" alt="image" src="https://github.com/kazuki-9/Shuffler_German-SRS-App/blob/main/UI.jpg" />
<img width="1178" height="632" alt="image" src="https://github.com/user-attachments/assets/ad54b6b9-c5f4-4ec4-95f2-36444522e2ec" />

## Setup
1. Access the Template: Open the ![Shuffler Google Sheet](https://docs.google.com/spreadsheets/d/1bqQFczcFHB5y_KDal2aDHsPy3q_e-2RImxaUPAmfX5E/edit?usp=sharing).
2. Create Your Copy: Go to `File > Make a copy` and rename it (e.g., "Shuffler_YourName").
3. Authorize Script: Open `Extensions > Apps Script > Run`, and follow the security prompts to grant the necessary permissions. (Note: If you see "Google hasn't verified this app," click "Advanced" and "Go to [Project Name] (unsafe)" to continue.)
4. Prepare Data: Switch to the "data" tab. Clear the example entries (or leave them if you like) and add your own content. Hint: Ensure at least the first four columns are filled for every row. 
5. Start Learning: Return to the "UI" tab and begin your practice session!
