/* Define variables */
let stats = null

/* Define svg-size. */
const width = 350
const height = 600

/* Create svg-element. */
const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

/* Define projection. */
const projection = d3.geoMercator()
  .scale(1200)
  .translate([-355, height/0.282])

/* Create path. */
const path = d3.geoPath(projection)

/* Create g-element for paths. */
const g = svg.append("g")

/* Define handleZoom. */
const handleZoom = (e) => {
  d3.select("g")
    .attr("transform", e.transform)
}

/* Define zoom. */
const zoom = d3.zoom()
  .scaleExtent([1, 5])
  .translateExtent([[0, 0], [width, height]])
  .on("zoom", handleZoom)

/* Define initZoom. */
const initZoom = () => {
  d3.select("svg")
    .call(zoom)
}

/* Define createMap. */
async function createMap() {

  const data = await d3.json("maakunnat.geojson")
  const municipalities = data.features

  // console.log(municipalities)

  g.selectAll("path")
    .data(municipalities)
    .enter()
    .append("path")
    .attr("fill", "lightgreen")
    .attr("class", (d, i) => {
      return `municipality ${d.properties.Maaku_ni1} ${d.properties.maaku2018}`})
    .attr("name", (d, i) => d.properties.Maaku_ni1)
    .attr("d", path)
    .on("click", showData)
}

/* Define showData() */
function showData() {

  d3.selectAll("path")
    .attr("fill", "lightgreen")

  const clickedMunicipality = d3.select(this).attr("name")
  
  if (clickedMunicipality == "Ahvenanmaan maakunta") {
    d3.selectAll(".Ahvenanmaan.maakunta").attr("fill", "red")
  } else {
    d3.selectAll(`.${clickedMunicipality}`).attr("fill", "red")
  }

  d3.select(".div")
    .selectAll("*")
    .remove()

  d3.select(".div")
    .append("h3")
    .text(clickedMunicipality)

  const municipalityNumber = "MK" + (d3.select(this).attr("class")).split(" ")[(d3.select(this).attr("class")).split(" ").length -1]

  stats.data.forEach(element => {
    if (element.key[element.key.length - 1] == municipalityNumber) {

      d3.select(".div")
        .append("p")
        .text(`Väkiluku: ${element.values[5]}`)

      d3.select(".div")
        .append("p")
        .text(`Väestönlisäys: ${element.values[4]}`)

      d3.select(".div")
        .append("p")
        .text(`Elävänä syntyneet: ${element.values[0]}`)
        
      d3.select(".div")
        .append("p")
        .text(`Kuolleet: ${element.values[1]}`)
          
      d3.select(".div")
        .append("p")
        .text(`Maahanmuutto: ${element.values[2]}`)
      
      d3.select(".div")
        .append("p")
        .text(`Maastamuuto: ${element.values[3]}`)

      d3.select(".div")
        .append("p")
        .attr("id", "source")
        .text("Lähde: Maanmittauslaitos, Tilastokeskus.")
    }
  })
}

/* Read csv-file. */
async function getData() {
  const response = await fetch("tilastokeskus-info.json")
  const stats = await response.json()
  return stats
}

/* Create div-element. */
const div = d3.select("body")
  .append("div")
  .attr("class", "div")

/* Create main(). */
async function main() {
    stats = await getData()
    // initZoom()
    createMap()
}

/* Run main(). */
main()