var insert = "";
var showHREFs = false;

/* call background.html to add a new link to library
 * ref : dom-node reference from which the link values are derived.
 * return : none
 */
function addFileToLibrary(ref){
  var mp3div = ref.parentNode.parentNode;
  var link = mp3div.childNodes[0].childNodes[0];
  chrome.extension.getBackgroundPage().addToLibrary(link.href, link.innerHTML);
  updateList();
}

/* toggle between "show URL" and "show anchor-text" in popup table*/ 
function toggleDisplay(){
  if (!showHREFs) 
    showHREFs = true;
  else 
    showHREFs = false;
  updateList();
}

/* create a link-node with add-button */
function addMP3LinkNode(href, text){
  insert += "<tr><td nowrap class=\"mp3linknode\"><a class=\"nolink\" href=\"" + href + "\">" + text + "</a></td>" +
  "<td nowrap><a href=\"#\" onClick=\"addFileToLibrary(this);\">Add to Library</a></td><td nowrap><a href=\"#\" onClick=\"play(this);\">Play Track</a></td></tr>";
}

/* create a link-node without add-button (for files that are already in the library)*/
function addMP3LinkNodeNoButton(href, text){
  insert += "<tr><td class=\"mp3linknode\" nowrap><a  class=\"nolink\" href=\"" + href + "\">" + text + "</a></td><td nowrap></td><td nowrap><a href=\"#\" onClick=\"play(this);\">Play Track</a></td></tr>";
}

/* call backgroundpage to play file instantly.
 * ref : dom-node reference from which the link values are derived.
 * return : none
 */
function play(ref){
  var mp3div = ref.parentNode.parentNode;
  var link = mp3div.childNodes[0].childNodes[0];
  chrome.extension.getBackgroundPage().playFile(link.href);
  
  //var debugd = document.getElementById("debugd");
  //debugd.innerHTML = "ID: "+chrome.extension.getBackgroundPage().myLibraryTabId;
}

/* updates the list of discovered files in the popup */
function updateList(){
    var bgLinks = chrome.extension.getBackgroundPage().links;
    console.log(bgLinks);
    var currentPageLinks = bgLinks.length;
  
    insert = "";
  
  for (i = 0; i < bgLinks.length; i++) {
  
    // check if that url is already in library and decide whether to show add-button  
    if (chrome.extension.getBackgroundPage().mp3IsInLibrary(bgLinks[i].href) == true) {
      if (showHREFs) {
        addMP3LinkNodeNoButton(bgLinks[i].href, bgLinks[i].href);
      }
      else {
        addMP3LinkNodeNoButton(bgLinks[i].href, bgLinks[i].text);
      }
      
    }
    else {
      if (showHREFs) {
        addMP3LinkNode(bgLinks[i].href, bgLinks[i].href);
      }
      else {
        addMP3LinkNode(bgLinks[i].href, bgLinks[i].text);
      }
    }
  }
  
  document.getElementById("links_found").innerHTML = insert;
	
}

