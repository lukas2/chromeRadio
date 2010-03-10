var insert = "";
var showHREFs = false;
	
// call background.html to add a new link to library
function addFileToLibrary(ref) {
    var mp3div = ref.parentNode.parentNode;
    var link = mp3div.childNodes[0].childNodes[0];
    chrome.extension.getBackgroundPage().addToLibrary(link.href,link.innerHTML);
    updateList();
}
	
function toggleDisplay() {
    if (!showHREFs) showHREFs = true;
    else showHREFs = false;
    updateList();		
}
	
// link-node with add-button
function addMP3LinkNode(href,text) {
    insert+="<tr><td class=\"mp3linknode\"><a href=\""+href+"\">"+text+"</a></td>"+
	"<td><a href=\"#\" onClick=\"addFileToLibrary(this);\">Add to Library</a></td><td><a href=\"#\" onClick=\"play(this);\">Play Track</a></td></tr>";	
}
	
// link-node without add-button
function addMP3LinkNodeNoButton(href,text) {
    insert+="<tr><td class=\"mp3linknode\"><a href=\""+href+"\">"+text+"</a></td><td></td><td><a href=\"#\" onClick=\"play(this);\">Play Track</a></td></tr>";	
}
	
function play(ref) {
    var mp3div = ref.parentNode.parentNode;
    var link = mp3div.childNodes[0].childNodes[0];
    chrome.extension.getBackgroundPage().playFile(link.href);
		
    //var debugd = document.getElementById("debugd");
    //debugd.innerHTML = "ID: "+chrome.extension.getBackgroundPage().myLibraryTabId;
}
	
	
function updateList() {
    var target = document.getElementById("links_found");
		
    target.innerHTML = "";
		
    var bgLinks = chrome.extension.getBackgroundPage().links;

    var currentPageLinks = bgLinks.length;
		
    insert = "";
		
    for(i = 0; i < bgLinks.length; i++) {
	// check if that mp3 is already in library and decide whether to show add-button
			
	if (chrome.extension.getBackgroundPage().mp3IsInLibrary(bgLinks[i].href) == true) {
	    if(showHREFs) {
		addMP3LinkNodeNoButton(bgLinks[i].href, bgLinks[i].href);
	    } else {
		addMP3LinkNodeNoButton(bgLinks[i].href, bgLinks[i].text);
	    }
				
	} else {
	    if(showHREFs) {
		addMP3LinkNode(bgLinks[i].href, bgLinks[i].href);
	    } else {
		addMP3LinkNode(bgLinks[i].href, bgLinks[i].text);
	    }			
	}	
    }
		
    target.innerHTML = insert;
}
