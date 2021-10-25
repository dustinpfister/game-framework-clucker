
(function(articleMod){

    articleMod.getStats = function(){
        var htmlCol = document.querySelectorAll('article');
        var stats = {
            elCount: htmlCol.length
        };
        return stats;

    }

}(this['articleMod'] = {}));