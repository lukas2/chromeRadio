	
	// CALLED WHEN BACKGROUND PAGE ASKS US TO UPDATE LINKS
	
	if (window == top) {
	chrome.extension.onRequest.addListener(function(req, sender, sendResponse) {
			// IST DAS NOTWENDIG? SCHEINT ABER BESSER ZU GEHEN MIT VERZOEGERUNG.
			 window.setTimeout("getAllLinks()", 500); 
		});
	}
	
	
	function getAllLinks()
	{
		// GET ALL LINKS

		mp3nodes = [];
		var nodes = document.getElementsByTagName("a");
		
		var re = /([^\/\\]+)\.(mp3)$/i
		
		// ITERATE ALL LINKS AND CHECK FOR MP3-EXTENSION
		
		for (var i = 0; i < nodes.length; i++)
		{
			//console.log("a.href= "+nodes[i].href);
			if (nodes[i].href.match(re) )
			{
				// ADD MP3 EXTENSION-LINKS TO NEW ARRAY

				text = nodes[i].innerText;
				href = nodes[i].href;
				
				if (!text)
				{
					text = href.substring(href.lastIndexOf('/')+1);
				}
				
				if (text.length <= 0)
				{			
					// IF TEXT IS EMPTY (e.g. IMG-LINK), SHOW FILENAME FOR TEXT
					text = href.substring(href.lastIndexOf('/')+1);
				}
				
				newLink = {"text":text, "href":href};
				mp3nodes.push(newLink);
			}
		}

		// SEND MP3-LINKS TO BACKGROUND PAGE
		
		/*if (mp3nodes.length == 0)
		{
			chrome.extension.sendRequest(null);	
		}
		else
		{*/
			chrome.extension.sendRequest(mp3nodes);	
		/*}*/
	}