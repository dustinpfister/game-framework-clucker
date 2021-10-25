
(function(articleMod){

    // get a main art object from the current document
    articleMod.getArtObj = function(){
        var htmlCol = document.querySelectorAll('article');
        var art = {
            elCount: htmlCol.length,
            htmlCol: htmlCol 
        };
        return art;
    };

    // get raw text from the given art object
    articleMod.rawText = function(art){
        return [].map.call(art.htmlCol, function(el){ return el.innerText;}).join()
    };

    // Get a hash code for a given art object
    // found here: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    // https://en.wikipedia.org/wiki/32-bit_computing
    articleMod.INTB32MAX = 4294967295;
    articleMod.hashCode = function(art) {
        var hash = 0, i, chr,
        str = articleMod.rawText(art);
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

}(this['articleMod'] = {}));