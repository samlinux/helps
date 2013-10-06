/**
 * Created with JetBrains PhpStorm.
 * User: rbole
 * Date: 06.10.13
 * Time: 14:28
 */

Ext.application({
    name: 'GridDemo_Summary_Duration',

    launch: function(){
        //--------------------------------
        // define some models
        //--------------------------------
            Ext.define('TestResult', {
                extend: 'Ext.data.Model',
                fields: [
                    {name: 'student', type:'string'},
                    {name: 'durationInSeconds', type: 'int'}
                ]
            });

            Ext.define('Duration',{
                extend: 'Ext.data.Model',
                fields: [{name:'durationInSeconds', type:'int'}]
            });

        //--------------------------------
        // define the duration store
        //--------------------------------
            Ext.create('Ext.data.Store', {
                model: 'Duration',
                storeId: 'storeDuration',
                data: [
                    {'durationInSeconds':0}
                ]
            });

        //--------------------------------
        // define the grid panel
        //--------------------------------

        Ext.create('Ext.grid.Panel', {

            width: 250,
            height: 200,
            title: 'Summary Test',
            style: 'padding: 20px',
            renderTo: document.body,
            features: [{
                ftype: 'summary'
            }],
            store: {
                model: 'TestResult',
                data: [{
                    student: 'Student 1',
                    durationInSeconds: 126000
                },{
                    student: 'Student 2',
                    durationInSeconds: 7200
                },{
                    student: 'Student 3',
                    durationInSeconds: 7200
                },{
                    student: 'Student 4',
                    durationInSeconds: 7500
                }]
            },
            columns: [
                {
                    dataIndex: 'student',
                    text: 'Name'
                },
                {
                    text: 'Duration',
                    dataIndex: 'durationInSeconds',
                    align:'right',
                    renderer: function(v, params, record,row){
                        return readableDuration(v);
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {

                        var duration =  Ext.getStore("storeDuration").getAt(0).get('durationInSeconds');
                        var out = readableDuration(duration);

                        return out;
                    },
                    summaryType: function(values){
                        var helpDuration=0;

                        Ext.Array.forEach(values, function (record){
                            helpDuration += record.data.durationInSeconds;
                        })

                        Ext.getStore("storeDuration").getAt(0).set('durationInSeconds',helpDuration);
                    }
                }
            ]
        });
    }

})


/**
 * original source by betamos
 * - https://github.com/betamos
 * - https://gist.github.com/betamos/6306791
 *
 * I did some modifications for the demo
 * we only need a format like [h]h:mm
 */

var readableDuration = (function() {

    // Each unit is an object with a suffix s and divisor d
    var units = [
        {s: '', d: 1}, // Seconds
        {s: '', d: 60}, // Minutes
        {s: ':', d: 60} // Hours
    ];

    // Closure function
    return function(t) {
        t = parseInt(t); // In order to use modulus
        var trunc, n = Math.abs(t), i, out = []; // out: list of strings to concat
        for (i = 0; i < units.length; i++) {
            n = Math.floor(n / units[i].d); // Total number of this unit
            // Truncate e.g. 26h to 2h using modulus with next unit divisor
            if (i+1 < units.length) // Tweak substr with two digits
                trunc = ('00'+ n % units[i+1].d).substr(-2, 2); // ?if not final unit
            else
                trunc = n;
            if(i>0)
             out.unshift(''+ trunc + units[i].s); // Output
        }
        (t < 0) ? out.unshift('-') : null; // Handle negative durations
        return out.join('');
    };
})();




