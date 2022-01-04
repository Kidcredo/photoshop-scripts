/*
  ClearLayer.jsx for Adobe Photoshop
  Description: Simple script to clear layers content.
  Date: June, 2019
  Author: Sergey Osokin, email: hi@sergosokin.ru
  ============================================================================
  Donate (optional): If you find this script helpful and want to support me 
  by shouting me a cup of coffee, you can by via PayPal http://www.paypal.me/osokin/usd
  ============================================================================
  NOTICE:
  This script is provided "as is" without warranty of any kind.
  ============================================================================
  Released under the MIT license.
  http://opensource.org/licenses/mit-license.php
  ============================================================================
  Check other author's scripts: https://github.com/creold
*/

//@target photoshop

app.bringToFront();

function main() {
  var doc = app.activeDocument;
  var selLayers = getSelectedLayersIdx();
  for (var i = 0; i < selLayers.length; i++) {
    makeActiveByIndex(selLayers[i], false);
    doc.activeLayer.clear();
  }
}

// This solution by geppettol66959005
// https://community.adobe.com/t5/photoshop/how-to-find-selected-layers-and-run-events/td-p/10269273?page=1
function getSelectedLayersIdx() {
  var selectedLayers = new Array
  var ref = new ActionReference()
  ref.putEnumerated(charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"))
  var desc = executeActionGet(ref)
  if (desc.hasKey(stringIDToTypeID('targetLayers'))){
    desc = desc.getList(stringIDToTypeID('targetLayers'))
    var selectedLayers = new Array()
    for (var i = 0; i < desc.count; i++){
      try {
        activeDocument.backgroundLayer
        selectedLayers.push(desc.getReference(i).getIndex())
      } catch (e) {
          selectedLayers.push(desc.getReference(i).getIndex() + 1)
      }
    }
  } else {
    var ref = new ActionReference()
    ref.putProperty(charIDToTypeID("Prpr"), charIDToTypeID("ItmI"));
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    try{
      activeDocument.backgroundLayer
      selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")) - 1);
    } catch (e) {
        selectedLayers.push(executeActionGet(ref).getInteger(charIDToTypeID("ItmI")))
      }
    }
  return selectedLayers
};  

function makeActiveByIndex(idx, visible) {
  var desc = new ActionDescriptor()
  var ref = new ActionReference()
  ref.putIndex(charIDToTypeID("Lyr "), idx)
  desc.putReference(charIDToTypeID("null"), ref)
  desc.putBoolean(charIDToTypeID("MkVs"), visible)
  executeAction(charIDToTypeID("slct"), desc, DialogModes.NO)
};  

// Run script
try {
  app.activeDocument.suspendHistory('Clear Layers Script', 'main()');  
} catch (e) { }