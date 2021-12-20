    
    
export const data_1 = {
        "header":{ //  Object
            "type": "one_numerical", // Data Type
            "id": ["id_name"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name"]  // Identifier of the field containing the numerical value (y axis)
        },
        "data": [ //  Array of Objects  
            { 
                "id_name": "Valor 1",
                "value_name": 1000
            },
            { 
                "id_name": "Valor 2",
                "value_name": 2000
            },
            { 
                "id_name": "Valor 3",
                "value_name": 3000
            },
            { 
                "id_name": "Valor 4",
                "value_name": 4000
            },
        ]
    };

export const data_2 = {
        "header":{ //  Object
            "type": "double_numerical", // Data Type
            "id": ["id_name"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name1","value_name2"]  // Identifier of the field containing the numerical value (y axis)
        },
        "data": [ //  Array of Objects  
            { 
                "id_name": "Valor 1",
                "value_name1": 8000,
                "value_name2": 4000
            },
            { 
                "id_name": "Valor 2",
                "value_name1": 5000,
                "value_name2": 7000
            },
            { 
                "id_name": "Valor 3",
                "value_name1": 13000,
                "value_name2": 4000
            },
            { 
                "id_name": "Valor 4",
                "value_name1": 7000,
                "value_name2": 6000
            },
        ]
    };

export const data_3 = {
        "header":{ //  Object
            "type": "time_series", // Data Type
            "id": ["date"],       // Identifier of the field containing the name (x axis)
            "value": ["value_name1","value_name2","value_name3"],   // Identifier of the field containing the numerical value (y axis)
            "time": ["d","m","y"] // 3 elems = d/m/y || 2 elems = mounth || 1 elem = day
        },
        "data": [ //  Array of Objects  
            { 
                "date": new Date("05/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("05/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("05/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("05/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            },
            { 
                "date": new Date("06/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("06/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("06/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("06/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            },
            { 
                "date": new Date("07/05/2019"),
                "value_name1": 4000,
                "value_name2": 9000,
                "value_name3": 1000
            },
            { 
                "date": new Date("07/03/2019"),
                "value_name1": 2000,
                "value_name2": 8000,
                "value_name3": 6000
            },
            { 
                "date": new Date("07/08/2019"),
                "value_name1": 8000,
                "value_name2": 7000,
                "value_name3": 1000
            },
            { 
                "date": new Date("07/06/2019"),
                "value_name1": 5000,
                "value_name2": 1000,
                "value_name3": 7000
            }
        ]
    };
