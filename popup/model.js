// model.js
// defines the comment class

class Comment {
  constructor(contents, comment) {
    // sanitize comment for html display
    this.rawText = contents;

    // comment parameter optional, copies usage data if provided
    if (comment) {
      this.timeLastUsed = comment.timeLastUsed;
      this.timesUsed = comment.timesUsed;
      this.selected = comment.selected;
    } else {
      this.timeLastUsed = new Date().getTime();
      this.timesUsed = 0;
      this.selected = false;
    }

    // extract options and text between them
    // e.g. input string "option {1|2|3} or perhaps {4|5|6} here"
    // this.texts = ["option", "or perhaps", "here"]
    // this.blanks = [[1, 2, 3], [4, 5, 6]]
    this.texts = [];
    this.rawTexts = [];
    this.blanks = [];
    let segments = contents.split(/^{|\s{/); // split on left curly brackets at start of string or after space
    let firstText = segments.shift();
    this.texts.push(sanitize(firstText));
    this.rawTexts.push(firstText);
    for (let segment of segments) {
      let idx = segment.search("}");
      let options = segment.substring(0, idx)
      this.blanks.push(sanitize(options.replace(/\\\|/g, "❘")).split("|")); // replace escaped | with similar unicode char (&#10072)
      let text = segment.substring(idx + 2);
      this.texts.push(sanitize(text));
      this.rawTexts.push(text);
    }
  }
}