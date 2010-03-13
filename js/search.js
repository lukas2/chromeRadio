if (!chromeRadio) var chromeRadio = {};
if (!chromeRadio.search) 
{
	chromeRadio.search = {};
}

/**
 * handler for searchbox. gets triggered everyt time an "onkeyup" event fires.
 * checks contents of library tables for given search word as a simple substring check
 * and display only those rows for which the check holds true.*/
chromeRadio.search = {
    search: function(tabid,text) {
		var tab = document.getElementById("table_cat_body_"+tabid);
		var trs = tab.getElementsByTagName("tr");
		var searchquery = text
		
		// first display all
		for (var h = 0; h < trs.length; h++)
		{
			trs[h].style.display = "";
		}
		
		var flipstyle = false;
		
		// now hide all that don't match search criterium
		for (var i = 0; i < trs.length; i++)
		{
			var url = trs[i].childNodes[1].childNodes[0].id.toLowerCase();
			var text = trs[i].childNodes[1].childNodes[0].innerText.toLowerCase();
			var tds = trs[i].getElementsByTagName("td");
			if(url.indexOf(searchquery.toLowerCase()) < 0 && text.indexOf(searchquery.toLowerCase()) < 0)
		    {
				trs[i].style.display = "none";
			}
			else
			{
				// alternating backgroun color by switching class of tds
				for(var j = 0; j < tds.length; j++)
				{
					if(flipstyle)
					{
						tds[j].className = "line1";
					}
					else
					{
						tds[j].className = "line2";
					}
				}
				
				if(flipstyle) flipstyle = false;
				else flipstyle = true;
			}
		}
    }
}
