
var gameMod = {};

gameMod.create = function(){

return {
        text: 'Hello World',
        pool: Clucker.poolMod.create({
            count: 8,
            secsCap: 0.25,
            disableLifespan: true,
            spawn: function(obj, pool){
                obj.data.homeRadian = Math.PI * 2 / pool.objects.length * obj.i;
                obj.data.deltaRadian = 0;
                obj.data.radian = obj.data.homeRadian;
                obj.data.radius = 100;
            },
            update: function (obj, pool, sm, secs){
               obj.data.deltaRadian = Math.PI / 180 * 45 * secs;
               obj.data.radian += obj.data.deltaRadian;
               obj.data.radian = Clucker.utils.mod(obj.data.radian, Math.PI * 2);  
               obj.lifespan = 1;
               obj.x = 400 - obj.w / 2 + Math.cos(obj.data.radian) * obj.data.radius;
               obj.y = 150 - obj.h / 2 + Math.sin(obj.data.radian) * obj.data.radius;
            }
        }),
        cx: 400,
        cy: 150,
        x: 0,
        y: 0,
        dir: 1,
        dx: 0,
        printOptions: {
            align: 'center',
            baseLine: 'middle',
            fontSize: 40
        },
        pointerDown: false
    }
};