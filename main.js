let histogram = (country, color, year) => ({
    "transform": [ { "filter": { "field": "year", "equal": year } } ],
    "mark": {
      type: "line",
      // type: "bar",
      // binSpacing: 0,
      // opacity: 0.5,
      color: color
    },
    "encoding": {
      "x": {
        "field": country,
        "bin": { "step": 10 },
        "type": "quantitative",
        "title": ""
      }
    }
  })

let spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "Yet another visual display to present indicators across countries and time frames",
  "data": { name: "table", values: data },
  "vconcat": [
    {
      "width": 800,
      "height": 100,
      // "transform": [ { "filter": { "field": "year", "equal": "2017-2018" } } ],
      "encoding": {
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "title": ""
        }
      },
      "layer": [
        histogram("Thailand", "blue", "2017-2018"),
        histogram("Viet Nam", "khaki", "2017-2018"),
        // histogram("Indonesia", "green", "2017-2018"),
        histogram("Malaysia", "red", "2017-2018"),
        // histogram("Singapore", "pink", "2017-2018"),
        // histogram("Philippines", "orange", "2017-2018")
      ]
    },
    {
      "width": 800,
      "height": 100,
      "encoding": {
        "y": {
          "aggregate": "count",
          "type": "quantitative",
          "title": ""
        }
      },
      "layer": [
        histogram("Thailand", "blue", "2017-2018"),
        // histogram("Thailand", "blue", "2016-2017"),
        // histogram("Thailand", "blue", "2015-2016"),
        // histogram("Thailand", "blue", "2014-2015"),
        // histogram("Thailand", "blue", "2013-2014"),
        // histogram("Thailand", "blue", "2012-2013"),
        // histogram("Thailand", "blue", "2011-2012"),
        // histogram("Thailand", "blue", "2010-2011"),
        // histogram("Thailand", "blue", "2009-2010"),
        // histogram("Thailand", "blue", "2008-2009"),
        histogram("Thailand", "lightblue", "2007-2008"),
      ]
    }
  ],
};
let opt = { 
  actions: {
    export: true,
    source: false,
    compiled: false,
    editor: false
  },
  i18n: {
    PNG_ACTION: "บันทึกเป็น PNG",
    SVG_ACTION: "บันทึกเป็น SVG"
  },
  renderer: "svg",
  scaleFactor: 2,
  downloadFileName: ""
};

vegaEmbed('#vis', spec, opt);