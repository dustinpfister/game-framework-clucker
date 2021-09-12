canvasMod.load({
    // points methods to add
    pointsMethods : [
        // a circle method
        {
            name: 'circle',
            method: function(stack, cx, cy, radius, pointCount){
                pointCount = pointCount === undefined ? 100 : pointCount;
                return canvasMod.createPoints(stack, 'oval', cx, cy, radius, radius, pointCount);
            }
        },
        // an oval method
        {
            name: 'oval',
            method: function(stack, cx, cy, radius1, radius2, pointCount){
                pointCount = pointCount === undefined ? 100 : pointCount;
                var points = [[]];
                var i = 0, x, y, radian;
                while(i < pointCount){
                    radian = Math.PI * 2 / pointCount * i;
                    x = cx + Math.cos(radian) * radius1;
                    y = cy + Math.sin(radian) * radius2;
                    points[0].push(x, y);
                    i += 1;
                }
                return points;
            }
        }
    ]
});