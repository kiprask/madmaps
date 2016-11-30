var vizjson = {
  "id": "236085de-ea08-11e2-958c-5404a6a683d5",
  "version": "0.1.0",
  "title": "example_cartodbjs_1 0",
  "likes": 0,
  "description": null,
  "scrollwheel": true,
  "legends": true,
  "url": null,
  "map_provider": "leaflet",
  "bounds": [
    [
      7.7109916554332,
      -230.625
    ],
    [
      59.888936896766,
      219.375
    ]
  ],
  "center": "[38.272688535980976, -5.625]",
  "zoom": 2,
  "updated_at": "2016-08-30T17:04:58+00:00",
  "layers": [
    {
      "options": {
        "visible": true,
        "type": "Tiled",
        "urlTemplate": "https:\/\/{s}.maps.nlp.nokia.com\/maptile\/2.1\/maptile\/newest\/normal.day\/{z}\/{x}\/{y}\/256\/png8?lg=eng&token=A7tBPacePg9Mj_zghvKt9Q&app_id=KuYppsdXZznpffJsKT24",
        "name": "Nokia Day",
        "className": "nokia_day",
        "attribution": "\u00a92012 Nokia <a href='http:\/\/here.net\/services\/terms' target='_blank'>Terms of use<\/a>",
        "subdomains": "1234"
      },
      "infowindow": null,
      "tooltip": null,
      "id": "5c48b664-50d5-4fe0-bb65-bd452b88ac6f",
      "order": 0,
      "type": "tiled"
    },
    {
      "type": "layergroup",
      "options": {
        "user_name": "documentation",
        "maps_api_template": "https:\/\/{user}.carto.com:443",
        "sql_api_template": "https:\/\/{user}.carto.com:443",
        "tiler_protocol": "http",
        "tiler_domain": "carto.com",
        "tiler_port": "80",
        "sql_api_protocol": "http",
        "sql_api_domain": "carto.com",
        "sql_api_endpoint": "\/api\/v2\/sql",
        "sql_api_port": 80,
        "filter": "mapnik",
        "layer_definition": {
          "stat_tag": "236085de-ea08-11e2-958c-5404a6a683d5",
          "version": "1.0.1",
          "layers": [
            {
              "id": "e5391db6-6f24-4090-9e01-29779e843221",
              "type": "CartoDB",
              "infowindow": null,
              "tooltip": {
                "type": 'tooltip',
                "template": '<p>{{variable}}</p>', // mustache template
                "width": 200,
                "position": 'bottom|right', // top, bottom, left and right are available
                "fields": [{ name: 'name', population: 'pop2005' }]
              },
              "legend": {
                "type": null
              },
              "order": 1,
              "visible": true,
              "options": {
                "layer_name": "example_cartodbjs_1",
                "cartocss": "#example_cartodbjs_1 {\n  marker-fill: #FF6600;\n  marker-opacity: 0.9;\n  marker-width: 12;\n  marker-line-color: white;\n  marker-line-width: 3;\n  marker-line-opacity: 0.9;\n  marker-placement: point;\n  marker-type: ellipse;\n  marker-allow-overlap: true;\n}",
                "cartocss_version": "2.1.1",
                "interactivity": "cartodb_id",
                "sql": "SELECT * FROM example_cartodbjs_1 where pop_other > 1000000",
                "table_name": "\"\"."
              }
            }
          ]
        },
        "attribution": ""
      }
    }
  ],
  "overlays": [
    {
      "type": "zoom",
      "order": 6,
      "options": {
        "display": true,
        "x": 20,
        "y": 20
      },
      "template": "<a href=\"#zoom_in\" class=\"zoom_in\">+<\/a> <a href=\"#zoom_out\" class=\"zoom_out\">-<\/a>"
    },
    {
      "type": "loader",
      "order": 8,
      "options": {
        "display": true,
        "x": 20,
        "y": 150
      },
      "template": "<div class=\"loader\" original-title=\"\"><\/div>"
    }
  ],
  "prev": null,
  "next": null,
  "transition_options": {
    
  }
};