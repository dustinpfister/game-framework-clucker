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
        str = typeof art === 'object' ? rawText(art) : art;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        // I will want to have a non signed value
        return hash + INTB32MAX / 2;
    };
    // get a hashPer 0-1 based on the given art object
    var hashPer = function(art){
        var hc = hashCode(art);
        return hc / INTB32MAX;
    };
    // tokenize the given art object based off of what is used in natutal.js ( MIT License )
    // Copyright (c) 2011, 2012 Chris Umbel, Rob Ellis, Russell Mull
    // https://github.com/NaturalNode/natural/blob/master/lib/natural/tokenizers/tokenizer.js
    // https://github.com/NaturalNode/natural/blob/master/lib/natural/tokenizers/aggressive_tokenizer.js
    var trim = function (array) {
        while (array[array.length - 1] === '') { array.pop() }
        while (array[0] === '') { array.shift() }
        return array;
    };
    var tokenize = function (art) {
        var str = rawText(art);
        return trim(str.split(/[\W|_]+/));
    };
    // get a main art object from the current document
    articleMod.getArtObj = function(opt){
        opt = opt || {};
        opt.wordGrades = opt.wordGrades || [500, 1000, 1800, 2400];
        // get an html collection of article elements for the current document
        var htmlCol = document.querySelectorAll('article');
        // base art stats object
        var art = {
            elCount: htmlCol.length,
            htmlCol: htmlCol,
            wordGrades: opt.wordGrades
        };
        // hash code and hash percent values
        art.hashCode = hashCode(art);
        art.hashPer = hashPer(art);
        // wordArray stats
        var wordArray = tokenize(art);
        art.wordCount = wordArray.length;
        art.wordPers = art.wordGrades.map(function(wc){
            var per = art.wordCount / wc;
            return parseFloat( (per > 1 ? 1 : per).toFixed(4) );
        });
        return art;
    };
    // create and return a map
    var newCell = function(cellIndex, opt){
         return { 
              i: cellIndex, 
              x: cellIndex % opt.w,
              y: Math.floor(cellIndex / opt.w),
              value : 0 
         };
    };
    articleMod.createMap = function(art, opt){
        opt = opt || {};
        opt.w = opt.w || 16;
        opt.h = opt.h || 6;
        var wordArray = tokenize(art);
        var cells = new Array(opt.w * opt.h),
        cellIndex = 0,
        wordIndex = wordArray.length;
        while(wordIndex--){
            var word = wordArray[wordIndex],
            cell = cells[cellIndex] === undefined ? newCell(cellIndex, opt) : cells[cellIndex];
            cell.value += word.length;
            cells[cellIndex] = cell;
            cellIndex += 1;
            cellIndex %= cells.length;
        }
        // return the map
        return {
           w: opt.w,
           cells: cells
        };
    };
}(this['articleMod'] = {}));
