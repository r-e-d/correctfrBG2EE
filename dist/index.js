const fs = require('fs');

class DialogFile {
  constructor(filename) {
    this.content = fs.readFileSync(filename, 'utf8');
    this.index = 0;
  }

  getLine() {
    if (this.index === this.content.length)
      return undefined;

    const begin = this.index++;
    while (this.index < this.content.length) {
      if (this.content[this.index] === '@' && this.content[this.index - 1] === '\n') {
        break;
      }
      ++this.index;
    }

    const separator = this.content.indexOf('=', begin);
    const nb = parseInt(this.content.substring(begin + 1, separator), 10);
    const text = this.content.substring(separator + 1, this.index).trim();
    return { nb, text };
  }
}

function main() {
  const ref = new DialogFile('tra/dialogref.tra');
  const fix = new DialogFile('tra/dialog.tra');

  const tphFD = fs.openSync('correctfrbg2ee/bg2ee.tph', 'w');
  const traFD = fs.openSync('correctfrbg2ee/francais/correctfr.tra', 'w');

  while (1) {
    const refLine = ref.getLine();
    const fixLine = fix.getLine();

    if (refLine === undefined && fixLine === undefined)
      break;

    if (refLine === undefined)
      throw { fixLine };

    if (fixLine === undefined)
      throw { refLine };

    if (refLine.nb !== fixLine.nb)
      throw { refLine, fixLine };

    if (refLine.text !== fixLine.text) {
      const offset = 1000000;
      fs.appendFileSync(tphFD, '\tSTRING_SET ~' + fixLine.nb + '~ @' + (offset + fixLine.nb) + '\n', 'utf8');
      fs.appendFileSync(traFD, '@' + (offset + fixLine.nb) + ' = ' + fixLine.text + '\n', 'utf8');
    }
  }
}

try {
  main();
}
catch (e) {
  console.error(e);
}
