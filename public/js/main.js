var contentNames = document.getElementsByClassName("card-title");
var contentURL = document.getElementsByClassName("value");
var x = document.getElementsByClassName("card-text");
for (i in x) {
    var text = x[i].innerHTML;
    if (text) {
        var count = text.length;
        var n = eval(+i + 1);
        if (count > 200) {
            x[i].innerHTML = text.substr(0, 200) + ' ...';
        }
    }
}

function redirectToPage() {
    console.log("Hello");
}









function searchRecommendation() {
    var userContentValue = document.getElementById("myInput").value;

    if (userContentValue.length > 0) {
        let result = [...contentNames].every(myfunction);
        function myfunction(item, index) {

            let userContentLower = userContentValue.toLowerCase();
            let itemLower = item.innerHTML.toLowerCase();
            const url = item.getAttribute("value");
            //console.log(url)
            //console.log(userContentLower)
            let result = itemLower.startsWith(userContentLower.slice(0, Math.max(itemLower.length - 1, 1)));

            if (result) {
                document.getElementById("suggestBox").style.display = "block";
                document.getElementById("suggestBox").innerHTML = item.innerHTML;
                document.getElementById("suggestBox").setAttribute("href", url);
                console.log(document.getElementById("suggestBox"));
                return false;
            }
            else {
                document.getElementById("suggestBox").style.display = "none";
                return true;
            }
        }
    }
    else {
        document.getElementById("suggestBox").style.display = "none";
    }
}

