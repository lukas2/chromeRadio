if (!chromeRadio) 
  var chromeRadio = {};
if (!chromeRadio.storage) 
  chromeRadio.storage = {};

chromeRadio.storage = {
  storagePrefix: "mp3_url:",
  storageName: "mp3_name:",
  categoryPrefix: "chromeRadioCat:",
  
  getAllCategories: function(){
    var categories = {};
    var i = -1;
    var len = localStorage.length;
    while (++i < len) {
      key = localStorage.key(i);
      if (key.substring(0, chromeRadio.storage.categoryPrefix.length) == chromeRadio.storage.categoryPrefix) {
        storage_key = key.substring(chromeRadio.storage.categoryPrefix.length);
        var category_name = localStorage.getItem(chromeRadio.storage.categoryPrefix + storage_key)
        categories[category_name] = category_name;
      }
    }
    return categories;
  },
  
  createNewCategory: function(){
    var category_field = document.getElementById("new_cat_textfield");
    chromeRadio.storage.saveCategory(category_field.value);
    chromeRadio.storage.getRadioItems();
	// refresh page
	window.location.reload();
  },
  
  saveCategory: function(new_category){
    chromeRadio.storage.setItem(chromeRadio.storage.categoryPrefix + new_category, new_category);
  },
  
  saveMp3Url: function(){
    var mp3_name = document.form_new_mp3.mp3_name.value;
    var mp3_url = document.form_new_mp3.mp3_url.value;
    var mp3_category = document.form_new_mp3.mp3_category.value;
    
    chromeRadio.storage.setItem(chromeRadio.storage.storagePrefix + mp3_url, mp3_name);
    chromeRadio.storage.setItem(chromeRadio.storage.categoryPrefix + mp3_category, mp3_url);
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "MP3 Saved into your Library.";
    setTimeout(function(){
      status.innerHTML = "";
    }, 750);
    getRadioItems();
  },
  
  setItem: function(key, value){
    try {
      window.localStorage.removeItem(key);
      window.localStorage.setItem(key, value);
    } 
    catch (e) {
    }
  },
  
  getItem: function(key){
    var value;
    try {
      value = window.localStorage.getItem(key);
    } 
    catch (e) {
      value = "null";
    }
    return value;
  },
  
  /**
   * THIS IS CALLED WHEN MY-LIBRARY LOADS 
   * 2 TASKS: GET ITEMS AND GET PULL-DOWN MENU
   */
  initializeEverything: function()
  {
	chromeRadio.storage.getRadioItems();
    chromeRadio.storage.getControls();
  },
  
  /**
   * GET PULL-DOWN MENU
   */
  getControls: function()
  {
	 var target = document.getElementById("action_select");
	
	 categories = chromeRadio.storage.getAllCategories();
	 alert("cat");
	 for (category in categories) {
		insert+="<option value=\""+category+"\">"+category+"</option>";
	 {
	 	 
	 target.innerHTML = insert;
  },
  
  /** 
   * GET ITEMS FROM LIBRARY AND DISPLAY THEM
   */
  getRadioItems: function(){
    var i = -1;
    var key;
    var len = localStorage.length;
    var tunes = {};
    var tunes_categories = {};
    var categories = {};
    var output_string = "";
    
    var flipcolor = false;
    
    while (++i < len) {
      key = localStorage.key(i);
      if (key.substring(0, chromeRadio.storage.storagePrefix.length) == chromeRadio.storage.storagePrefix) {
        storage_key = key.substring(chromeRadio.storage.storagePrefix.length);
        tunes[storage_key] = localStorage.getItem(key);
        var category_name = localStorage.getItem(chromeRadio.storage.categoryPrefix + storage_key)
        tunes_categories[storage_key] = category_name;
        categories[category_name] = category_name;
        
        if (flipcolor) {
          output_string += "<tr>" +
          "<td class=\"line1\"><input type=\"checkbox\" name=\"check_" +
          storage_key +
          "\"/></td>" +
          "<td class=\"line1\"><a onclick=\"chromeRadio.storage.playme(this.id);return false;\" href=\"#\" id=\"" +
          storage_key +
          "\"> " +
          tunes[storage_key] +
          "</a></td>" +
          "<td class=\"line1\"> Category: " +
          tunes_categories[storage_key] +
          "</td><td class=\"line1\"><a onclick=\"chromeRadio.storage.deleteme(this.id);return false;\" href=\"#\" id=\"" +
          storage_key +
          "\">delete me</a></td>" +
          "</tr>";
          
          flipcolor = false;
        }
        else {
          output_string += "<tr>" +
          "<td class=\"line2\"><input type=\"checkbox\" name=\"check_" +
          storage_key +
          "\"/></td>" +
          "<td class=\"line2\"><a onclick=\"chromeRadio.storage.playme(this.id);return false;\" href=\"#\" id=\"" +
          storage_key +
          "\"> " +
          tunes[storage_key] +
          "</a></td>" +
          "<td class=\"line2\"> Category: " +
          tunes_categories[storage_key] +
          "</td><td class=\"line2\"><a onclick=\"chromeRadio.storage.deleteme(this.id);return false;\" href=\"#\" id=\"" +
          storage_key +
          "\">delete me</a></td>" +
          "</tr>";
          flipcolor = true;
        }
      }
    }
    var my_library = document.getElementById("bodyNotInCategory");
    my_library.innerHTML = output_string;
    
    
    
  },
  
  playme: function(url){
    var my_radio_player = document.getElementById("my-radio-player");
    var my_radio_player_current_url = document.getElementById("my-radio-player-current-url");
    
    my_radio_player_current_url.innerHTML = "Currently playing: " + url;
    
    my_radio_player.setAttribute('src', url);
    my_radio_player.setAttribute('currentSrc', url);
    my_radio_player.currentTime = 0;
    my_radio_player.load();
    my_radio_player.play();
  },
  
  deleteme: function(url){
    window.localStorage.removeItem(chromeRadio.storage.storagePrefix + url);
    chromeRadio.storage.getRadioItems();
  },
  
  importLibrary: function(){
    var importTextarea = document.getElementById('import_textarea');
    var tunesJSONString = importTextarea.value;
    var tunes = JSON.parse(tunesJSONString);
    for (var i in tunes) {
      var this_item = tunes[i];
      chromeRadio.storage.setItem(chromeRadio.storage.storagePrefix + this_item[chromeRadio.storage.storagePrefix], this_item[chromeRadio.storage.storageName]);
    }
    chromeRadio.storage.getRadioItems();
  },
  
  exportLibrary: function(){
    var i = -1;
    var key;
    var len = localStorage.length;
    var tunes = {};
    var output_string = "";
    while (++i < len) {
      key = localStorage.key(i);
      if (key.substring(0, 8) == chromeRadio.storage.storagePrefix) {
        var this_item = {};
        storage_key = key.substring(8);
        this_item[chromeRadio.storage.storagePrefix] = storage_key;
        this_item[chromeRadio.storage.storageName] = localStorage.getItem(key);
        tunes[i] = this_item;
      }
    }
    var tunesJSONString = JSON.stringify(tunes);
    var exportTextarea = document.getElementById('export_textarea');
    exportTextarea.value = tunesJSONString;
    chromeRadio.storage.showMe("div_export_textarea");
  },
  
  showMe: function(divName){
    var divExportTextarea = document.getElementById(divName);
    divExportTextarea.style.display = "block";
  },
  
  hideMe: function(divName){
    var divExportTextarea = document.getElementById(divName);
    divExportTextarea.style.display = "none";
  }
}

// instantly-play file listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
  console.log(request);
  sendResponse({}); //immediately
  //alert(links);
  if (request.playme) {
  
    chromeRadio.storage.playme(request.playme);
    
  }
});

// SELECT ALL CHECKBOXES IN LIBRARY
function selectAll(){
  var boxes = document.getElementById('bodyNotInCategory').getElementsByTagName('input');
  
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = true;
  }
}

// UN-SELECT ALL CHECKBOXES IN LIBRARY
function selectNone(){
  var boxes = document.getElementById('bodyNotInCategory').getElementsByTagName('input');
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }
}

