const width = 1000;
const height = 100;
const domain_end = 140;
const axis = { grid: false, title: false, ticks: false, tickCount: 1, labelExpr: "'อันดับดี'", labelPadding: 10 };

const opaque_color_value = (x, a) => (255-a*(255-x));
const opaque_color_string = (r, g, b, a) => "rgb(" + opaque_color_value(r,a) + "," + opaque_color_value(g,a) + "," + opaque_color_value(b,a) + ")";
const opacity = 0.3;
const colors = {
  ไทย: { 
    transparent: ["SteelBlue", "DodgerBlue", "blue"], 
    opaque: [opaque_color_string(70, 130, 180, opacity), opaque_color_string(30, 144, 255, opacity), opaque_color_string(0, 0, 255, opacity)]
  },
  เวียดนาม: { 
    transparent: ["mediumseagreen", "seagreen", "green"], 
    opaque: [opaque_color_string(60, 179, 113, opacity), opaque_color_string(46, 139, 87, opacity), opaque_color_string(0, 128, 0, opacity)]
  },
  มาเลเซีย: { 
    transparent: ["lightsalmon", "indianred", "red"], 
    opaque: [opaque_color_string(255, 160, 122, opacity), opaque_color_string(205, 92, 92, opacity), opaque_color_string(255, 0, 0, opacity)]
  },
}

let histogram = (country, color, year, max_y=20) => ({
    transform: [ { filter: { field: "year", equal: year } } ],
    mark: {
      type: "area",
      interpolate: "basis", //"cardinal", //"monotone",
      // type: "bar",
      // binSpacing: 0,
      opacity: opacity,
      color: color
      // line: { color: color},
      // color: {
      //   x1: 1, y1: 1, x2: 1, y2: 0,
      //   gradient: "linear",
      //   stops: [
      //     { offset: 0, color: "white" },
      //     { offset: 1, color: color }
      //   ]
      // }
    },
    encoding: {
      x: {
        field: country,
        bin: { step: 5 },
        type: "quantitative",
        // sort: "descending",
        scale: { domain: [0, domain_end] },
        // axis: null,
        axis: axis
      },
      y: {
        aggregate: "count",
        type: "quantitative",
        scale: { domain: [0, max_y] },
        axis: null
      }
    }
  });
let mean = (country, color, year) => ({
    transform: [ { filter: { field: "year", equal: year } } ],
    mark: {
      type: "rule",
      opacity: opacity,
    },
    encoding: {
      x: {
        field: country,
        aggregate: "mean",
        type: "quantitative",
        // sort: "descending",
        scale: { domain: [0, domain_end] },
        // axis: null
        axis: axis
      },
      color: { value: color},
      size: { value: 2}
    }
  });
let mean_rect = (country, color, year) => ({
  transform: [ { filter: { field: "year", equal: year } } ],
  mark: {
    type: "bar",
    baseline: "top",
    align: "left",
    // opacity: opacity,
  },
  encoding: {
    x: {
      field: country,
      aggregate: "mean",
      type: "quantitative",
      scale: { domain: [0, domain_end] },
      axis: axis
    },
    x2: { value: 500 },
    y: { value: 0 },
    y2: { value: 10 },
    color: { value: color }
  }
});
let mean_text = (country, year, text) => ({
    transform: [ { filter: { field: "year", equal: year } } ],
    mark: {
      type: "text",
      baseline: "top",
      align: "left",
      dx: 5
    },
    encoding: {
      x: {
        field: country,
        aggregate: "mean",
        type: "quantitative",
        // sort: "descending",
        scale: { domain: [0, domain_end] },
        // axis: null
        axis: axis
      },
      y: { value: 0 },
      color: { value: "white" }, //{value: color},
      text: { value: text }
    }
  });
let subtitle = (text) => ({
    mark: {
      type: "text",
      baseline: "top",
      align: "left",
      dx: 5
    },
    encoding: {
      x: { value: 0 },
      y: { value: 0 },
      color: { value: "black" },
      text: { value: text }
    }
  })
let histograms = (country, colors, text, max_y) => ([
    histogram(country, colors["transparent"][0], "2007-2008", max_y),
    mean(country, colors["transparent"][0], "2007-2008"),
    mean_rect(country, colors["opaque"][0], "2007-2008"),
    mean_text(country, "2007-2008", "2551"),

    histogram(country, colors["transparent"][1], "2012-2013", max_y),
    mean(country, colors["transparent"][1], "2012-2013"),
    mean_rect(country, colors["opaque"][1], "2012-2013"),
    mean_text(country, "2012-2013", "2556"),

    histogram(country, colors["transparent"][2], "2017-2018", max_y),
    mean(country, colors["transparent"][2], "2017-2018"),
    mean_rect(country, colors["opaque"][2], "2017-2018"),
    mean_text(country, "2017-2018", "2561"),

    subtitle(text)
  ])

let spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v3.json",
  description: "Yet another visual display to present indicators across countries and time frames",
  config: {
    style: { cell: { stroke: "transparent" } },
    axis: { labelFont: "Noto Sans Thai UI", titleFont: "Noto Sans Thai UI", titlePadding: 15 },
    text: { font: "Noto Sans Thai UI" }
  },
  data: { name: "table", values: data },
  vconcat: [
    {
      width: width,
      height: height,
      layer: []
    },
    {
      width: width,
      height: height,
      // transform: [ { filter: { field: "year", equal: "2017-2018" } } ],
      layer: [
        histogram("Viet Nam", colors["เวียดนาม"]["transparent"][2], "2017-2018"),
        mean("Viet Nam", colors["เวียดนาม"]["transparent"][2], "2017-2018"),
        mean_rect("Viet Nam", colors["เวียดนาม"]["opaque"][2], "2017-2018"),
        mean_text("Viet Nam", "2017-2018", "เวียดนาม"),

        histogram("Thailand", colors["ไทย"]["transparent"][2], "2017-2018"),
        mean("Thailand", colors["ไทย"]["transparent"][2], "2017-2018"),
        mean_rect("Thailand", colors["ไทย"]["opaque"][2], "2017-2018"),
        mean_text("Thailand", "2017-2018", "ไทย"),

        histogram("Malaysia", colors["มาเลเซีย"]["transparent"][2], "2017-2018"),
        mean("Malaysia", colors["มาเลเซีย"]["transparent"][2], "2017-2018"),
        mean_rect("Malaysia", colors["มาเลเซีย"]["opaque"][2], "2017-2018"),
        mean_text("Malaysia", "2017-2018", "มาเลเซีย"),

        subtitle("2561")
      ]
    },
    {
      width: width,
      height: height,
      layer: histograms("Viet Nam", colors["เวียดนาม"], "เวียดนาม")
    },
    {
      width: width,
      height: height,
      layer: histograms("Malaysia", colors["มาเลเซีย"], "มาเลเซีย")
    },
    {
      width: width,
      height: height,
      layer: [
        histogram("Thailand", "gainsboro", "2017-2018"),
        histogram("Thailand", "gainsboro", "2016-2017"),
        histogram("Thailand", "gainsboro", "2015-2016"),
        histogram("Thailand", "gainsboro", "2014-2015"),
        histogram("Thailand", "gainsboro", "2013-2014"),
        histogram("Thailand", "gainsboro", "2012-2013"),
        histogram("Thailand", "gainsboro", "2011-2012"),
        histogram("Thailand", "gainsboro", "2010-2011"),
        histogram("Thailand", "gainsboro", "2009-2010"),
        histogram("Thailand", "gainsboro", "2008-2009"),
        histogram("Thailand", "gainsboro", "2007-2008"),

        subtitle("ไทย")
      ]
    },
    {
      width: width,
      height: height,
      layer: histograms("Thailand", colors["ไทย"], "ไทย")
    },
    {
      width: width,
      height: height,
      transform: [ { filter: { field: "code", range: [1, 5] } } ],
      layer: histograms("Thailand", colors["ไทย"], "ไทย (มิติที่ 1: Enabling Environment)", 5)
    },
    {
      width: width,
      height: height,
      transform: [ { filter: { field: "code", range: [5, 7] } } ],
      layer: histograms("Thailand", colors["ไทย"], "ไทย (มิติที่ 2: Human Capital)", 5)
    },
    {
      width: width,
      height: height,
      transform: [ { filter: { field: "code", range: [7, 11] } } ],
      layer: histograms("Thailand", colors["ไทย"], "ไทย (มิติที่ 3: Markets)", 5)
    },
    {
      width: width,
      height: height,
      transform: [ { filter: { field: "code", range: [11, 13] } } ],
      layer: histograms("Thailand", colors["ไทย"], "ไทย (มิติที่ 4: Innovation)", 5)
    }
  ],
};

const countries = Object.keys(data[0]).filter(c => c !== "year" && c !== "code" && c !== "name")
countries.forEach(c => {
  spec.vconcat[0].layer.push(histogram(c, "gainsboro", "2017-2018"));
});
spec.vconcat[0].layer.push(subtitle("ทั่วโลก"));

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