import { writeFile } from "node:fs";

writeFile(
  "UseAMEthodWithACallback/testMessage.txt",
  "I'm a new file! Hello there!",
  (error) => {
    if (error) {
      throw error;
    }
    console.log("testMessage.txt file has been successfully saved!");
  }
);
