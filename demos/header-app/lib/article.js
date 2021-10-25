
(function(articleMod){

    // Constant for the limit of a 32bit unsigned integer
    // this is used by the hashPer method
    // https://en.wikipedia.org/wiki/32-bit_computing
    var INTB32MAX = 4294967295;

    // get raw text from the given art object
    var rawText = function(art){
        return [].map.call(art.htmlCol, function(el){ return el.innerText;}).join()
    };

    // Get a hash code for a given art object
    // found here: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    // https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    var hashCode = function(art) {
        var hash = 0, i, chr,
        str = rawText(art);
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    // get a hashPer 0-1 based on the given art object
    var hashPer = function(art){
        var hc = hashCode(art);
        return hc / INTB32MAX;
    };

    // get a main art object from the current document
    articleMod.getArtObj = function(){
        var htmlCol = document.querySelectorAll('article');
        var art = {
            elCount: htmlCol.length,
            htmlCol: htmlCol,
        };
        art.hashCode = hashCode(art);
        art.hashPer = hashPer(art);
        return art;
    };



}(this['articleMod'] = {}));