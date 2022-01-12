// import regression from 'regression'


let loadHandler = function (evt) {
    let data = [[50,3.3],[50,2.8],[50,2.9],[70,2.3],[70,2.6],[70,2.1],[80,2.5],[80,2.9],[80,2.4],[90,3.0],[90,3.1],[90,2.8],[100,3.3],[100,3.5],[100,3.0]]
    let result = regression.polynomial(data, { order: 3 });

    console.log(result["equation"]);

    /*
    50	3.3
2	50	2.8
3	50	2.9
4	70	2.3
5	70	2.6
6	70	2.1
7	80	2.5
8	80	2.9
9	80	2.4
10	90	3.0
11	90	3.1
12	90	2.8
13	100	3.3
14	100	3.5
15	100	3.0

     */

}


onload = loadHandler;