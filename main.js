const mark_size = 250;
const countries = ["ไทย", "เกาหลีใต้", "มาเลเซีย", "เวียดนาม", "อินโดนีเซีย"];
const colors = ["#4c78a8", "#e45756", "#54a24b", "#eeca3b", "#ff9da6"];
const years = [2000, 2020];

const index_names = {
  women_in_parliament: "เปอร์เซ็นต์ผู้แทนฯ หญิงในสภาฯ", //"Seats held by men in national parliaments (%)",
  gini: "สัมประสิทธิ์จีนี (1-100)", //"Gini Coefficient adjusted for top income (1-100)",
  employment: "เปอร์เซ็นต์การมีงานทำ", //"Unemployment rate (% total labor force)",
  education_rank: "อันดับคุณภาพการศึกษา (WEF)", //"Quality of education system (15-24 age group, rank)"
  work_hours_per_person: "ชั่วโมงทำงานต่อคนต่อปี",
  productivity_gdp_per_hour: "จีดีพีต่อชั่วโมงทำงาน"
};
const index_sorts = {
  women_in_parliament: "ascending",
  gini: "descending",
  employment: "ascending",
  education_rank: "descending",
  work_hours_per_person: "descending",
  productivity_gdp_per_hour: "ascending"
}
const pairs = [
  { x: "work_hours_per_person", y: "productivity_gdp_per_hour", first: 2000, last: 2014 },
  { x: "employment", y: "education_rank", first: 2015, last: 2018 },
  { x: "women_in_parliament", y: "gini", first: 2014, last: 2017 }
];
const default_pair_idx = 0;

const spec_point = (size, tooltip) => ({
  "type": "point",
  "filled": true,
  "strokeWidth": 1,
  "stroke": "white",
  "opacity": 1,
  "size": size,
  "tooltip": tooltip
});
const spec_condition = (selection) => ({
  "selection": selection,
  "title": "ประเทศ", 
  "field": "country",
  "type": "nominal",
  "legend": null,
  "sort": countries,
  "scale": { "domain": countries, "range": colors }
});
let spec = {
  "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
  "description": "A dashboard to show where Thailand is, compared across time and selected countries",
  "data": { name: "table", url: "data.csv" },
  "transform": [
    { "calculate": "+datum.year + 543", "as": "year-th" }
  ],
  "config": {
    "style": { "cell": { "stroke": "transparent" } },
    "axis": { "labelFont": "IBM Plex Thai", "titleFont": "IBM Plex Thai", "titlePadding": 15 }
  },
  vconcat: [
    { //legend
      "encoding": {
        "color": {
          "condition": spec_condition("legend_filter"),
          "value": "lightgray"
        },
        "y": {
          "type": "nominal",
          "field": "country",
          "title": null,
          axis: { orient: "right", domain: false, ticks: false } 
        }
      },
      "mark": spec_point(mark_size, false),
      "selection": {
        "legend_filter": {
          "type": "multi",
          "encodings": ["color"],
          "on": "mouseover",
          // "toggle": "event.shiftKey",
          // "clear": "dblclick",
          // "resolve": "global",
          // "empty": "all"
        }
      }
    },
    { //chart
      "width": 600,
      "height": 400,
      // "autosize": {
      //   "type": "fit-x",
      //   "resize": true,
      //   "contains": "padding"
      // },
      "view": {
        "fill": {
          "gradient": "linear",
          "x1": 1.5, "y1": -0.5,
          "x2": 0, "y2": 0.5,
          "stops": [
            {"offset": 0.3, "color": "palegoldenrod"},
            {"offset": 0.9, "color": "white"},
          ]
        }
      },
      "encoding": {
        "order": { "field": "year-th", "type": "ordinal", "title": "พ.ศ.", "sort": "descending" },
        "tooltip": [
          { "field": "country", "type": "nominal", "title": "ประเทศ" },
          { "field": "year-th", "type": "ordinal", "title": "พ.ศ." }
        ]
      },
      "layer": [
        { //lines
          "encoding": {
            // "size": {
            //   "field": "year",
            //   "type": "quantitative",
            //   "scale": { "range": [0, 5] },
            //   "legend": false
            // },
            "color": { 
              "condition": spec_condition({ or: ["legend_filter", "same_year"] }),
              "value": "lightgray"
            },
          },
          "mark": {
            "type": "line",
            "size": 2,
            "interpolate": "cardinal" //"cardinal"
          }
          // "mark": {
          //   "type": "trail",
          //   // "defined": true,
          //   "interpolate": "monotone" //"cardinal"
          // }
        },
        { //points
          "encoding": {
            // "stroke": {
            //   "condition": { "selection": "same_year", "value": "white" },
            //   "value": "transparent"
            // },
            "color": {
              "condition": spec_condition({ or: ["legend_filter", "same_year"] }),
              "value": "lightgray"
            }
            // "color": {
            //   "title": "ประเทศ", 
            //   "field": "country",
            //   "type": "nominal",
            //   "legend": null,
            //   "sort": countries,
            //   "scale": { "domain": countries, "range": colors }
            //   // "condition": spec_condition("same_year"),
            //   // "value": "transparent"
            // }
          },
          "mark": spec_point(mark_size/4, true),
          "selection": {
            "same_year": {
              "type": "multi",
              "fields": ["year"],
              "on": "mouseover",
              // "toggle": "event.shiftKey",
              // "clear": "dblclick",
              // "resolve": "global",
              // "empty": "none"
            }
          }
        },
        { //last point
          "transform": [ 
            { "filter": {} }
          //   { "filter": { "field": "year", "equal": "2014" } },
          //   // { "window": { "op": "last_value", "field": "year", "as": "last" } },
          //   // { "calculate": "'flags/' + datum.country + '.png'", "as": "url" }
          //   // { "calculate": "{'ไทย': '🇹🇭','เกาหลีใต้': '🇰🇷','มาเลเซีย': '🇲🇾','เวียดนาม': '🇻🇳','อินโดนีเซีย': '🇮🇩'}[datum.country]", "as": "emoji" }
          ],
          // "encoding": {
          //   "url": { field: "url", "type": "nominal" }
          // },
          // "mark": {
          //   type: "image",
          //   width: "20",
          //   heigth: "20"
          // }
          // "encoding": {
          //   "text": { field: "emoji", "type": "nominal" },
          //   "size": { "value": 20 }
          // },
          // "mark": {
          //   type: "text",
          //   baseline: "middle"
          // }
          "encoding": {
            "color": {
              "condition": spec_condition({ or: ["legend_filter", "same_year"] }),
              "value": "lightgray"
            }
          },
          "mark": spec_point(mark_size, true)
        }
      ]
    }
  ]
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

let change_axes = idx => {
  spec.vconcat[1].encoding.x = {
    "title": index_names[pairs[idx].x],
    "field": pairs[idx].x,
    "type": "quantitative",
    "scale": { "zero": false },
    "sort": index_sorts[pairs[idx].x]
  };
  spec.vconcat[1].encoding.y = {
    "title": index_names[pairs[idx].y],
    "field": pairs[idx].y,
    "type": "quantitative",
    "scale": { "zero": false },
    "sort": index_sorts[pairs[idx].y]
  };
  // spec.vconcat[1].layer[0].encoding.size.scale.domain = [pairs[idx].first, pairs[idx].last];
  spec.vconcat[1].layer[2].transform[0].filter = {
    field: "year",
    equal: pairs[idx].last
  };

  opt.downloadFileName = "ippd-" + pairs[idx].x + "-" + pairs[idx].y;
}
change_axes(default_pair_idx);

let buttons = [];
for (let i = 1; i <= 3; i++) {
  buttons.push(document.getElementById("button" + i));
}

vegaEmbed('#vis', spec, opt).then(res => {
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      change_axes(i);
      vegaEmbed('#vis', spec, opt);
  
      buttons.forEach(b => {
        b.classList.remove("selected");
      })
      button.classList.add("selected");
    });
  });
});