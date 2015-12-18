var gui = require('nw.gui');

var KeyShort={
  registerKey:function(key,callback){
    var option = {
      key : key,
      active : function() {
        
        console.log("dengyp: " + this.key + " active."); 
      },
      failed : function(msg) {
        console.log('dengyp registerKey error msg');
      }
    };

    var shortcut = new gui.Shortcut(option);
    //console.dir(shortCut);
    gui.App.unregisterGlobalHotKey(shortcut);
    gui.App.registerGlobalHotKey(shortcut);

    // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
    // will get an "active" event.

    // You can also add listener to shortcut's active and failed event.
    shortcut.on('active', function() {
      callback();
      console.log("dengyp Global desktop keyboard shortcut: " + this.key + " active."); 
    });

    shortcut.on('failed', function(msg) {
      console.log('dengyp  shortcut error'+msg);
    });
  }
}


export default KeyShort;