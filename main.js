const domain_end = 160;
const axis = { grid: false, title: false, ticks: false, tickCount: 1, labelExpr: "'อันดับดี'", labelPadding: 10 };

let histogram = (country, color, year) => ({
    "transform": [ { "filter": { "field": "year", "equal": year } } ],
    "mark": {
      type: "area",
      interpolate: "basis", //"cardinal", //"monotone",
      // type: "bar",
      // binSpacing: 0,
      opacity: 0.5,
      color: color
      // line: { color: color},
      // color: {
      //   "x1": 1, "y1": 1, "x2": 1, "y2": 0,
      //   "gradient": "linear",
      //   "stops": [
      //     { "offset": 0, "color": "white" },
      //     { "offset": 1, "color": color }
      //   ]
      // }
    },
    "encoding": {
      "x": {
        "field": country,
        "bin": { "step": 5 },
        "type": "quantitative",
        "sort": "descending",
        "scale": { "domain": [0, domain_end] },
        // "axis": null,
        "axis": axis
      },
      "y": {
        "aggregate": "count",
        "type": "quantitative",
        "scale": { "domain": [0, 30] },
        "axis": null
      }
    }
  });
let mean = (country, color, year) => ({
    "transform": [ { "filter": { "field": "year", "equal": year } } ],
    "mark": "rule",
    "encoding": {
      "x": {
        "field": country,
        "aggregate": "mean",
        "type": "quantitative",
        "sort": "descending",
        "scale": { "domain": [0, domain_end] },
        // "axis": null
        "axis": axis
      },
      "color": {"value": color},
      "size": {"value": 2}
    }
  });
let mean_text = (country, color, year, text) => ({
    "transform": [ { "filter": { "field": "year", "equal": year } } ],
    "mark": {
      type: "text",
      "baseline": "top",
      "align": "left",
      "dx": 5
    },
    "encoding": {
      "x": {
        "field": country,
        "aggregate": "mean",
        "type": "quantitative",
        "sort": "descending",
        "scale": { "domain": [0, domain_end] },
        // "axis": null
        "axis": axis
      },
      "y": { "value": 0 },
      "color": {"value": color},
      "text": {"value": text }
    }
  });

let spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "Yet another visual display to present indicators across countries and time frames",
  "config": {
    "style": { "cell": { "stroke": "transparent" } },
    "axis": { "labelFont": "Noto Sans Thai UI", "titleFont": "Noto Sans Thai UI", "titlePadding": 15 },
    "text": { "font": "Noto Sans Thai UI" }
  },
  "data": { name: "table", values: data },
  "vconcat": [
    {
      "width": 800,
      "height": 100,
      // "transform": [ { "filter": { "field": "year", "equal": "2017-2018" } } ],
      "layer": [
        histogram("Viet Nam", "gold", "2017-2018"),
        mean("Viet Nam", "gold", "2017-2018"),
        mean_text("Viet Nam", "gold", "2017-2018", "เวียดนาม"),

        histogram("Thailand", "blue", "2017-2018"),
        mean("Thailand", "blue", "2017-2018"),
        mean_text("Thailand", "blue", "2017-2018", "ไทย"),

        histogram("Malaysia", "red", "2017-2018"),
        mean("Malaysia", "red", "2017-2018"),
        mean_text("Malaysia", "red", "2017-2018", "มาเลเซีย"),
      ]
    },
    {
      "width": 800,
      "height": 100,
      "layer": [
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
        mean("Thailand", "lightblue", "2007-2008"),
        mean_text("Thailand", "lightblue", "2007-2008", "2551"),
        histogram("Thailand", "blue", "2017-2018"),
        mean("Thailand", "blue", "2017-2018"),
        mean_text("Thailand", "blue", "2017-2018", "2561"),
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
  downloadFileName: "wef"
};

vegaEmbed('#vis', spec, opt);