function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  buildCharts(sampleNames[0])
  buildMetadata(sampleNames[0])
})}

init();

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = sampleArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumber[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuID = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    //  Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuID,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: otuID,
        size: sampleValues,
        colorscale: 'YlGnBu',
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:{title: "OTU ID"},
      height: 600,
      width: 1200
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // Create the trace for the gauge chart.

    var wash = data.metadata.filter(x => x.id == sample)[0];
    var washFreq = parseFloat(wash.wfreq)
    console.log(washFreq)
    
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washFreq,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 10]},
        bar: {color: "black" },
        steps: [
          { range:[0, 2], color: "chartreuse" },
          { range:[2, 4], color: "greenyellow" },
          { range:[4, 6], color: "lightsteelblue" },
          { range:[6, 8], color: "cornflowerblue" },
          { range:[8, 10], color: "royalblue" }
        ]
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 400, 
      margins: {t:50,  b: 50}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 
  });
}
