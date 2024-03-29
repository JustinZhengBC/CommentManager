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
    this.actives = [];
    let segments = contents.split(/^{|\s{/); // split on left curly brackets at start of string or after space
    let firstText = segments.shift();
    this.texts.push(this.sanitize(firstText));
    this.rawTexts.push(firstText);
    for (let segment of segments) {
      var idx = segment.search("}");
      if (idx == -1) {
        idx = 0;
      }
      let options = segment.substring(0, idx)
      this.blanks.push(this.sanitize(options.replace(/\\\|/g, "❘")).split("|")); // replace escaped | with similar unicode char (&#10072)
      this.actives.push(this.blanks[this.blanks.length - 1][0]);
      let text = segment.substring(idx + 2);
      this.texts.push(this.sanitize(text));
      this.rawTexts.push(text);
    }
  }

  sanitize(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\{/g, "{");
  }
  
}
