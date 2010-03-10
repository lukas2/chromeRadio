if (!chromeRadio) var chromeRadio = {};

chromeRadio = {
    storagePrefix: "mp3_url:",
    storageName: "mp3_name:",
    categoryPrefix: "chromeRadioCat:",

    // Saves options to localStorage.
    saveMp3Url: function() {
	var mp3_name = document.form_new_mp3.mp3_name.value;
	var mp3_url = document.form_new_mp3.mp3_url.value;
	var mp3_category = document.form_new_mp3.mp3_category.value;

	chromeRadio.setItem(chromeRadio.storagePrefix + mp3_url, mp3_name);
	chromeRadio.setItem(chromeRadio.categoryPrefix + mp3_category, mp3_url);
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
	var tunes = {};
        var tunes_categories = {};
        var categories = {};
	var output_string = "<table class=\"library_table\">";
	
	output_string += "<tr><td class=\"lineheader\"><a onClick=\"selectAll();\" href=\"#\">All</a> <a  onClick=\"selectNone();\" href=\"#\">None</a></td><td class=\"lineheader\">File</td><td class=\"lineheader\">Category</td><td class=\"lineheader\">Action</td></tr>";
	
	var flipcolor = false;
	
	while ( ++i < len ) { 
	    key = localStorage.key( i );
	    if (key.substring(0, chromeRadio.storagePrefix.length) == chromeRadio.storagePrefix) {
		storage_key = key.substring(chromeRadio.storagePrefix.length);
		tunes[storage_key] = localStorage.getItem( key );
		var category_name = localStorage.getItem(chromeRadio.categoryPrefix + storage_key)
		tunes_categories[storage_key] = category_name;
		categories[category_name] = category_name;
		
		if(flipcolor)
		{
		output_string += "<tr>" + 
		    "<td class=\"line1\"><input type=\"checkbox\" name=\"check_"+storage_key+"\"/></td>"+
			"<td class=\"line1\"><a onclick=\"chromeRadio.playme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\"> " + tunes[storage_key] + "</a></td>" +
		    "<td class=\"line1\"> Category: " +
		    tunes_categories[storage_key] +
		    "</td><td class=\"line1\"><a onclick=\"chromeRadio.deleteme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\">delete me</a></td>" +
		    "</tr>"
		    ;		
			
			flipcolor = false;
		}
		else
		{
		output_string += "<tr>" + 
		    "<td class=\"line2\"><input type=\"checkbox\" name=\"check_"+storage_key+"\"/></td>"+
			"<td class=\"line2\"><a onclick=\"chromeRadio.playme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\"> " + tunes[storage_key] + "</a></td>" +
		    "<td class=\"line2\"> Category: " +
		    tunes_categories[storage_key] +
		    "</td><td class=\"line2\"><a onclick=\"chromeRadio.deleteme(this.id);return false;\" href=\"#\" id=\"" + storage_key + "\">delete me</a></td>" +
		    "</tr>"
		    ;	
			
			flipcolor = true;
		}
		

	    }
	}
	
	output_string += "</table>";
	
	output_string += "<table class=\"controls_table\">";
	
	output_string += "<tr><td style=\"font-weight: bold;\">With Selected: </td>";
	output_string += "<td><select id=\"action_select\">";
	
	output_string += "<option value=\"delete\">Delete Selected</option>";
	output_string += "<option value=\"movecat1\">Move To Category 1</option>";
	output_string += "<option value=\"movecat2\">Move To Category 2</option>";
	output_string += "<option value=\"export\">Export</option>";
	
	output_string += "</select></td><td><input type=\"button\" value=\"OK\"></td>"+
	
	"<td style=\"border-left: 1px solid #000;\">&nbsp;Create New Category:</td><td><input type=\"text\" id=\"new_cat_textfield\"></td><td><input type=\"button\" onClick=\"createNewCategory();\" value=\"Ok\"></tr>";
	output_string += "</table>";

	output_string += "<h2>Categories</h2><ul>";
	for (category in categories) {
	    output_string += "<li>" + (category) + "</li>";
	}
	output_string += "</ul>";

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
	var tunesJSONString = importTextarea.value;
	var tunes = JSON.parse(tunesJSONString);
	for (var i in tunes) {
	    var this_item = tunes[i];
	    chromeRadio.setItem(chromeRadio.storagePrefix + this_item[chromeRadio.storagePrefix], this_item[chromeRadio.storageName]);
	}
	chromeRadio.getRadioItems();
    },

    exportLibrary: function () {
	var i = -1;
	var key;
	var len = localStorage.length;
	var tunes = {};
	var output_string = "";
	while ( ++i < len ) { 
	    key = localStorage.key( i );
	    if (key.substring(0, 8) == chromeRadio.storagePrefix) {
		var this_item = {};
		storage_key = key.substring(8);
		this_item[chromeRadio.storagePrefix] = storage_key;
		this_item[chromeRadio.storageName] = localStorage.getItem( key );
		tunes[i] = this_item;
	    }
	}
	var tunesJSONString = JSON.stringify(tunes);
	var exportTextarea = document.getElementById('export_textarea');
	exportTextarea.value = tunesJSONString;
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

// SELECT ALL CHECKBOXES IN LIBRARY
function selectAll()
{
	var boxes = document.getElementsByClassName("library_table")[0].getElementsByTagName("input");
	for (var i = 0; i < boxes.length; i++)
	{
		boxes[i].checked = true;
	}
}

// UN-SELECT ALL CHECKBOXES IN LIBRARY
function selectNone()
{
	var boxes = document.getElementsByClassName("library_table")[0].getElementsByTagName("input");
	for (var i = 0; i < boxes.length; i++)
	{
		boxes[i].checked = false;
	}
}

