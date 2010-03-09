chromeRadioStoragePrefix = "mp3_url:";
chromeRadioStorageName = "mp3_name:";

// Saves options to localStorage.
function saveMp3Url() {
  var mp3_name = document.form_new_mp3.mp3_name.value;
  var mp3_url = chromeRadioStoragePrefix + document.form_new_mp3.mp3_url.value;
  setItem(mp3_url, mp3_name);

  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "MP3 Saved into your Library.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
  getRadioItems();
}

function setItem(key, value) {
  try {
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
  }catch(e) {
  }
}

//Gets the item from local storage with the specified key
function getItem(key) {
  var value;
  try {
    value = window.localStorage.getItem(key);
  }catch(e) {
    value = "null";
  }
  return value;
}

// Get all stored radio items
function getRadioItems() {
   var i = -1;
   var key;
   var len = localStorage.length;
   var res = {};
   var output_string = "";
   while ( ++i < len ) { 
       key = localStorage.key( i ); // retrieve the value of each key at each index
       if (key.substring(0, 8) == chromeRadioStoragePrefix) {
         storage_key = key.substring(8);
         res[storage_key] = localStorage.getItem( key ); // retrieve the value using the getItem method
         output_string += "<li>" + 
         "<a onclick=\"playme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\"> " + res[storage_key] + "</a> " + 
	 "<a onclick=\"deleteme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\">delete me</a>" +
         "</li>"
;
       }
   }

  var my_library = document.getElementById("my_library");
  my_library.innerHTML = output_string;
}

function playme(url) {
  var my_radio_player = document.getElementById("my-radio-player");
  var my_radio_player_current_url = document.getElementById("my-radio-player-current-url");
  
  my_radio_player_current_url.innerHTML = "Currently playing: "+url;
 
  my_radio_player.setAttribute('src', url);
  my_radio_player.setAttribute('currentSrc', url);
  my_radio_player.currentTime=0;
  my_radio_player.load();
  my_radio_player.play();
}

function deleteme(url) {
  window.localStorage.removeItem(chromeRadioStoragePrefix + url);
  getRadioItems();
}

function importLibrary() {
  var importTextarea = document.getElementById('import_textarea');
  var resJSONString = importTextarea.value;
  var res = JSON.parse(resJSONString);
  for (var i in res) {
    var this_item = res[i];
    setItem(chromeRadioStoragePrefix + this_item[chromeRadioStoragePrefix], this_item[chromeRadioStorageName]);
  }
  getRadioItems();
}

function exportLibrary() {
  var i = -1;
  var key;
  var len = localStorage.length;
  var res = {};
  var output_string = "";
  while ( ++i < len ) { 
    key = localStorage.key( i );
    if (key.substring(0, 8) == chromeRadioStoragePrefix) {
      var this_item = {};
      storage_key = key.substring(8);
      this_item[chromeRadioStoragePrefix] = storage_key;
      this_item[chromeRadioStorageName] = localStorage.getItem( key );
      res[i] = this_item;
    }
  }
  var resJSONString = JSON.stringify(res);
  var exportTextarea = document.getElementById('export_textarea');
  exportTextarea.value = resJSONString;
  showMe("div_export_textarea");
}

function showMe(divName) {
  var divExportTextarea = document.getElementById(divName);
  divExportTextarea.style.display = "block";
}

function hideMe(divName) {
  var divExportTextarea = document.getElementById(divName);
  divExportTextarea.style.display = "none";
}

// instantly-play file listener

	chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {		
		console.log(request);
		sendResponse({}); //immediately
		//alert(links);
		if(request.playme){
	
			playme(request.playme);
			
		}
	});

