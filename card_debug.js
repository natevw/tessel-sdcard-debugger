var tessel = require('tessel'),
    sd = require('sdcard'),
    pt = require('parsetition');

function dump(buf, bytesPerLine) {
  bytesPerLine || (bytesPerLine = 32);
  while (buf.length) {
    console.log(buf.slice(0, bytesPerLine).toString('hex'));
    buf = buf.slice(bytesPerLine);
  }
}

sd.use(tessel.port['A'], function (e) {
    if (e) throw e;
    
    var card = this;
    card.readBlock(0, function (e,d) {
      if (e) throw e;
      console.log(" == Block 0 == ");
      dump(d);
      
      var info = pt.parse(d);
      console.log(info);
      info.partitions.forEach(function (p,i) {
        card.readBlock(p.firstSector, function (e,d) {
          if (e) throw e;
          console.log(" == First block of partition %s == ", i);
          dump(d);
        });
      });
    });
});