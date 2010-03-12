if (!chromeRadio) 
  var chromeRadio = {};
if (!chromeRadio.storage) 
  chromeRadio.storage = {};

chromeRadio.storage = {
  urlPrefix: "chromeRadioURL:",
  namePrefix: "chromeRadioName:",
  categoryPrefix: "chromeRadioCat:",

  /** get all URLs that belong to a particular category
   *  params  category name of the category
   *  returns unordered array of urls
  */
  getAllUrlsInCategory: function(category){
	//var urls = {};
	var urls = new Array();
	var i = -1;
	var len = localStorage.length;
	while (++i < len) 
	{
	    key = localStorage.key(i);
	    if (key.substring(0, chromeRadio.storage.categoryPrefix.length) == chromeRadio.storage.categoryPrefix) 
		{
			storage_key = key.substring(chromeRadio.storage.categoryPrefix.length);
			var category_name = localStorage.getItem(chromeRadio.storage.categoryPrefix + storage_key);
			//urls[storage_key] = category_name;
			if(category_name == category && storage_key != category_name)
			{
				urls.push(storage_key);
			}
		}

	}
	return urls;
  },
  
  getAllUrls: function(){
	//var urls = {};
	var urls = new Array();
	var i = -1;
	var len = localStorage.length;
	while (++i < len) 
	{
	    key = localStorage.key(i);
	    if (key.substring(0, chromeRadio.storage.categoryPrefix.length) == chromeRadio.storage.categoryPrefix) 
		{
			storage_key = key.substring(chromeRadio.storage.categoryPrefix.length);
			var category_name = localStorage.getItem(chromeRadio.storage.categoryPrefix + storage_key);
			//urls[storage_key] = category_name;
			if(storage_key != category_name)
			{
				urls.push(storage_key);
			}
		}

	}
	return urls;
  },
  
  /* get table-formatted links for a category to display in library 
   * input category name 
   * return html-string
   */
  getLinksInCategory: function(category)
  {
	
	if(category == null)
	{
		var urls = chromeRadio.storage.getAllUrls();
	}
	else
	{
		var urls = chromeRadio.storage.getAllUrlsInCategory(category);
	}
	
	insert = "";
	var flipcolor = true;
	for(var i = 0; i < urls.length; i++)
	{
		insert+= "<tr>"+
		'<td id="'+((flipcolor)?'line1':'line2')+'"><input type="checkbox" name="check_'+urls[i] +'"/></td>'+
		'<td id="'+((flipcolor)?'line1':'line2')+'"><a onclick="chromeRadio.storage.playme(this.id);return false;"'+
		'href="#" id="' + urls[i] +'">' + urls[i] +'</a></td>';
		insert += "</tr>";
		
		if(flipcolor) {flipcolor = false;} else {flipcolor = true;}
	}
      return insert;       
  },
  
    
 
 

  /** get all stored categories
   *  params  none
   *  returns unordered assoc array of categories
  */
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
  
  /** create a new category from my-library.html
   *  params  none
   *  returns none
  */
  createNewCategory: function(){
    var category_field = document.getElementById("new_cat_textfield");
    chromeRadio.storage.saveCategory(category_field.value);
    chromeRadio.storage.getRadioItems();
    // refresh page
    window.location.reload();
  },
  
  /** saves a category
   *  params  new_category category name
   *  returns none
  */
  saveCategory: function(new_category){
    chromeRadio.storage.setItem(chromeRadio.storage.categoryPrefix + new_category, new_category);
  },
  
  /** save a file into local storage,
   *  also replaces already existing information
   *  use this to change the name and/or the category of an item
   *  url serves as the internal storage key
   *  params  url      url of the item
   *          name     user-readable name
   *          category the url's user-assigned category
   *  returns none
  */
  saveUrl: function(url,name,category)
  {
    chromeRadio.storage.setItem(chromeRadio.storage.urlPrefix + url, name);
    chromeRadio.storage.setItem(chromeRadio.storage.categoryPrefix + url, category); 

    // Update status to let user know options were saved.
    /*var status = document.getElementById("status");
    status.innerHTML = "URL saved into your Library.";
    setTimeout(function(){
      status.innerHTML = "";
    }, 750);
    getRadioItems();*/
  },
  
  saveMp3Url: function(){
    var this_name = document.form_new_mp3.mp3_name.value;
    var this_url = document.form_new_mp3.mp3_url.value;
    var this_category = document.form_new_mp3.mp3_category.value;
    chromeRadio.storage.saveUrl(this_url, this_name, this_category);
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
      //chromeRadio.storage.getRadioItems();
      chromeRadio.storage.getControls();
  },
  
  /**
   * GET PULL-DOWN MENU
   */
  getControls: function()
  {
      var target = document.getElementById("action_select");
      
      categories = chromeRadio.storage.getAllCategories();
      var insert="";
      insert+="<option value=\"act_delete\">Delete Selected</option>";
      insert+="<option value=\"act_nop\">----</option>";
      for (category in categories) {
	  insert+="<option value=\"cat_"+category+"\">Move to Category \""+category+"\"</option>";
      }
      insert+="<option value=\"act_nop\">----</option>";
      insert+="<option value=\"act_export\">Export Library</option>";
      insert+="<option value=\"act_import\">Import Library</option>";
      
      target.innerHTML = insert;
  },
  
  /** 
   * HANDLER FOR THE PULL-DOWN MENU
   */
  performWithSelected: function()
  {
      var selectfield = document.getElementById("action_select");
      var selindex  = selectfield.selectedIndex
      var selvalue = selectfield.options[selindex].value
      
      var selectedCheckboxes = chromeRadio.storage.getSelectedCheckboxes();
      
      if(selvalue == "act_export")
	  {
	      chromeRadio.storage.exportLibrary(); return false;
	  }
      else if(selvalue == "act_import")
	  {
	      chromeRadio.storage.showMe('div_import_textarea'); return false;
	  }
      else if(selvalue == "act_nop")
	  {
	      //do nothing at all
	  }
	  else if(selvalue == "act_delete")
	      {
		  for(var i = 0; i < selectedCheckboxes.length; i++)
		      {
			  var url = selectedCheckboxes[i].name.substring(6, selectedCheckboxes[i].name.length);
			  chromeRadio.storage.deleteme(url);
		      }
	      }
	  else 
	      {
		  //var categories = chromeRadio.storage.getAllCategories();
			// move to category
			if(selvalue.indexOf("cat_") == 0)
			{
				//move to selvalue to secified category
				var newcat = selvalue.substring(4,selvalue.length);
				
				for(var i = 0; i < selectedCheckboxes.length; i++)
				{
					var url = selectedCheckboxes[i].name.substring(6, selectedCheckboxes[i].name.length);
					var file = chromeRadio.storage.getItem(chromeRadio.storage.categoryPrefix + url);
					//alert("URL: "+url+", FILE:"+file +"NEWCAT: "+newcat);
					//chromeRadio.storage.deleteme(url);
					chromeRadio.storage.saveUrl(url,url,newcat);
				}
			}		

		  }
		  
		  
		
  		// refresh page
		window.location.reload();
		
  },
  
  /**
   * returns array of dom-input nodes that are the selected checkboxes
   */
  getSelectedCheckboxes: function()
  {
	var inputs = document.getElementsByTagName("input");
	var checkboxes = new Array();
	
	for(var i = 0; i < inputs.length; i++)
	{
		if (inputs[i].type == "checkbox")
		{
			/* only add checked items */
			if(inputs[i].checked == true)
			{
				checkboxes.push(inputs[i]);	
			}		
		}
	}
	return checkboxes;
  },
  

  getSelectedMp3s: function(){
    var i=0;    
    var selectedMp3Items;
    while (i++ < localStorage.length) {
      key = localStorage.key(i);
      if (key.substring(0, chromeRadio.storage.urlPrefix.length) == chromeRadio.storage.urlPrefix) {
        storage_key = key.substring(chromeRadio.storage.urlPrefix.length);
        selectedMp3Items += document.getElementsByName('check_'+storage_key)[0];
      }
    }
    console.log(selectedMp3Items);
  
  },

	moveMp3toCategorie: function(){
    var i=0;

	},

  /** 
   * GET ITEMS FROM LIBRARY AND DISPLAY THEM
   */
   /*
  getRadioItems: function(){
    var i = -1;
    var key;
    var len = localStorage.length;
    var tunes = {};
    var tunes_categories = chromeRadio.storage.getAllCategories();
    var categories = {};
    var output_string = "";
    var storage_key;
    
    var flipcolor = false;
    var element ="";
    
    while (++i < len) {
      key = localStorage.key(i);
      if (key.substring(0, chromeRadio.storage.urlPrefix.length) == chromeRadio.storage.urlPrefix) {
        storage_key = key.substring(chromeRadio.storage.urlPrefix.length);
        tunes[storage_key] = localStorage.getItem(key);
        element = "bodyAllMp3s";
        if (flipcolor) {
          output_string += chromeRadio.storage.genTable(storage_key,flipcolor,true,tunes_categories[storage_key]);
          flipcolor = false;
        }
        else {
          output_string += chromeRadio.storage.genTable(storage_key ,flipcolor,true,tunes_categories[storage_key]);
          flipcolor = true;

        }
      }
    }
    var my_library = document.getElementById(element);
    my_library.innerHTML = output_string;
  },*/
  genTable: function(storage_key, flipcolor, withCategories, tunes_categories){
      var output_string = "<tr>" +
      '<td id="'+((flipcolor)?'line1':'line2')+'"><input type="checkbox" name="check_'+storage_key +'"/></td>' +
      '<td id="'+((flipcolor)?'line1':'line2')+'"><a onclick="chromeRadio.storage.playme(this.id);return false;"'+
      'href="#" id="' + storage_key +'">' + storage_key +'</a></td>';
    if(withCategories){
        output_string += '<td id="'+((flipcolor)?'line1':'line2')+'"> Category: "' + tunes_categories+'</td>';        
    }
    
      return output_string;
  },
  playme: function(url){
    var my_radio_player = document.getElementById("my-radio-player");
    var my_radio_player_current_url = document.getElementById("my-radio-player-current-url");
    
    my_radio_player_current_url.innerHTML = "File: " + url;
    
    my_radio_player.setAttribute('src', url);
    my_radio_player.setAttribute('currentSrc', url);
    my_radio_player.currentTime = 0;
    my_radio_player.load();
    my_radio_player.play();
  },
  
  deleteme: function(url){
    window.localStorage.removeItem(chromeRadio.storage.urlPrefix + url);
	window.localStorage.removeItem(chromeRadio.storage.categoryPrefix + url);
    //chromeRadio.storage.getRadioItems();
  },
  
  importLibrary: function(){
    var importTextarea = document.getElementById('import_textarea');
    var tunesJSONString = importTextarea.value;
    var tunes = JSON.parse(tunesJSONString);
    for (var i in tunes) {
      var this_item = tunes[i];
      chromeRadio.storage.setItem(chromeRadio.storage.urlPrefix + this_item[chromeRadio.storage.urlPrefix], this_item[chromeRadio.storage.namePrefix]);
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
      if (key.substring(0, 8) == chromeRadio.storage.urlPrefix) {
        var this_item = {};
        storage_key = key.substring(8);
        this_item[chromeRadio.storage.urlPrefix] = storage_key;
        this_item[chromeRadio.storage.namePrefix] = localStorage.getItem(key);
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
  //console.log(request);
  sendResponse({}); //immediately
  //alert(links);
  if (request.playme) {
  
    chromeRadio.storage.playme(request.playme);
    
  }
});

// SELECT ALL CHECKBOXES IN LIBRARY
function selectAll(){
  var boxes = document.getElementById('bodyAllMp3s').getElementsByTagName('input');
  
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = true;
  }
}

// UN-SELECT ALL CHECKBOXES IN LIBRARY
function selectNone(){
  var boxes = document.getElementById('bodyAllMp3s').getElementsByTagName('input');
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = false;
  }
}

