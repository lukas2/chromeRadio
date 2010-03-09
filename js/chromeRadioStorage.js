if (!chromeRadio) var chromeRadio = {};

chromeRadio = {
    storagePrefix: "mp3_url:",
    storageName: "mp3_name:",

    // Saves options to localStorage.
    saveMp3Url: function() {
	var mp3_name = document.form_new_mp3.mp3_name.value;
	var mp3_url = chromeRadio.storagePrefix + document.form_new_mp3.mp3_url.value;
	chromeRadio.setItem(mp3_url, mp3_name);

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "MP3 Saved into your Library.";
	setTimeout(function() {
		status.innerHTML = "";
	    }, 750);
	getRadioItems();
    },

    saveMp3Item: function (name, url, category) {
    },

    setItem: function (key, value) {
	try {
	    window.localStorage.removeItem(key);
	    window.localStorage.setItem(key, value);
	}catch(e) {
	}
    },

    //Gets the item from local storage with the specified key
    getItem: function (key) {
	var value;
	try {
	    value = window.localStorage.getItem(key);
	}catch(e) {
	    value = "null";
	}
	return value;
    },

    // Get all stored radio items
    getRadioItems: function () {
	var i = -1;
	var key;
	var len = localStorage.length;
	var res = {};
	var output_string = "";
	while ( ++i < len ) { 
	    key = localStorage.key( i ); // retrieve the value of each key at each index
	    if (key.substring(0, 8) == chromeRadio.storagePrefix) {
		storage_key = key.substring(8);
		res[storage_key] = localStorage.getItem( key ); // retrieve the value using the getItem method
		output_string += "<li>" + 
		    "<a onclick=\"chromeRadio.playme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\"> " + res[storage_key] + "</a> " + 
		    "<a onclick=\"chromeRadio.deleteme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\">delete me</a>" +
		    "</li>"
		    ;
	    }
	}

	var my_library = document.getElementById("my_library");
	my_library.innerHTML = output_string;
    },

    playme: function (url) {
	var my_radio_player = document.getElementById("my-radio-player");
	var my_radio_player_current_url = document.getElementById("my-radio-player-current-url");
  
	my_radio_player_current_url.innerHTML = "Currently playing: "+url;
 
	my_radio_player.setAttribute('src', url);
	my_radio_player.setAttribute('currentSrc', url);
	my_radio_player.currentTime=0;
	my_radio_player.load();
	my_radio_player.play();
    },

    deleteme: function (url) {
	window.localStorage.removeItem(chromeRadio.storagePrefix + url);
	chromeRadio.getRadioItems();
    },

    importLibrary: function () {
	var importTextarea = document.getElementById('import_textarea');
	var resJSONString = importTextarea.value;
	var res = JSON.parse(resJSONString);
	for (var i in res) {
	    var this_item = res[i];
	    chromeRadio.setItem(chromeRadio.storagePrefix + this_item[chromeRadio.storagePrefix], this_item[chromeRadio.storageName]);
	}
	chromeRadio.getRadioItems();
    },

    exportLibrary: function () {
	var i = -1;
	var key;
	var len = localStorage.length;
	var res = {};
	var output_string = "";
	while ( ++i < len ) { 
	    key = localStorage.key( i );
	    if (key.substring(0, 8) == chromeRadio.storagePrefix) {
		var this_item = {};
		storage_key = key.substring(8);
		this_item[chromeRadio.storagePrefix] = storage_key;
		this_item[chromeRadio.storageName] = localStorage.getItem( key );
		res[i] = this_item;
	    }
	}
	var resJSONString = JSON.stringify(res);
	var exportTextarea = document.getElementById('export_textarea');
	exportTextarea.value = resJSONString;
	chromeRadio.showMe("div_export_textarea");
    },

    showMe: function (divName) {
	var divExportTextarea = document.getElementById(divName);
	divExportTextarea.style.display = "block";
    },

    hideMe: function (divName) {
	var divExportTextarea = document.getElementById(divName);
	divExportTextarea.style.display = "none";
    }
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

