const fs = require('fs');

console.log(process.cwd());

const ref = fs.readFileSync('tra/dialogref.tra');
const tra = fs.readFileSync('tra/dialog.tra');

console.log(ref.length);
console.log(tra.length);

fs.writeFileSync('correctfrBG2EE/BG2EE.tph', 'foo');
fs.writeFileSync('correctfrBG2EE/francais/correcfr.tra', 'bar');
