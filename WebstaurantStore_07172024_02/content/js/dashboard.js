/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9051477597712106, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "3_select product-857 - /facebookConversion"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-931 - /uploads/images/2018/3/fontello.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-105 - /pinterestConversion"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-690 - /api/pagecreatorbanner"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-880 - /marketing:analytics/getproductdataforanalytics/"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-930 - /refrigeration-equipment.html"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-103 - /facebookConversion"], "isController": false}, {"data": [0.5, 500, 1500, "2_selectproduct category-672 - /outlet.html"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-711 - /PageView"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-828 - /pinterestConversion"], "isController": false}, {"data": [0.0, 500, 1500, "A_launch_website (Outlet)"], "isController": true}, {"data": [1.0, 500, 1500, "1_launch_website-99  -/pinterestConversion"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-647 - /PageView"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-818 - /"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-826 - /facebookConversion"], "isController": false}, {"data": [0.0, 500, 1500, "B_selectproduct category"], "isController": true}, {"data": [1.0, 500, 1500, "2_selectproduct category-704 - /api/shoppingcart/items"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-709 - /facebookConversion"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-100 - /PageView"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-39 - /uploads/images/2018/3/fontello.woff2"], "isController": false}, {"data": [0.0, 500, 1500, "C_selectproduct "], "isController": true}, {"data": [0.5, 500, 1500, "2_selectproduct category-672 - /outlet.html-1"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-118 /api/shoppingcart/items"], "isController": false}, {"data": [0.5, 500, 1500, "1_launch_website-35 - /outlet.html"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-51 - /api/pagecreatorbanner"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-894 - /marketing:analytics/getproductdataforanalytics/"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-672 - /outlet.html-0"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-102 - /PageView"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-98 - /facebookConversion"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-777 - /api/pagecreatorbanner"], "isController": false}, {"data": [0.98, 500, 1500, "3_select product-803 - /api:edgecache/getdynamicdata/"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-677 - /uploads/images/2018/3/fontello.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "1_launch_website-84 - /api:edgecache/getdynamicdata/"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-645 - /pinterestConversion"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-710 - /pinterestConversion"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-751 - /outlet/<C_Outlet_Item>.html"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-832 - /marketing:analytics/getproductdataforanalytics/"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-641 - /api/shoppingcart/items"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-644 - /facebookConversion"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-810 - /api/shoppingcart/items"], "isController": false}, {"data": [0.96, 500, 1500, "2_selectproduct category-702 - /api:edgecache/getdynamicdata/"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-756 - /uploads/images/2018/3/fontello.woff2"], "isController": false}, {"data": [1.0, 500, 1500, "2_selectproduct category-731 - /restaurant-equipment.html"], "isController": false}, {"data": [1.0, 500, 1500, "3_select product-831 - /PageView"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 977, 0, 0.0, 167.16171954964182, 23, 1082, 118.0, 303.20000000000005, 641.8999999999992, 839.6600000000001, 1.0877431278460012, 13.795525367335975, 1.5792263468753827], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["3_select product-857 - /facebookConversion", 25, 0, 0.0, 357.31999999999994, 259, 609, 343.0, 462.0, 564.8999999999999, 609.0, 0.03253467220016371, 0.011660375681113362, 0.06449998763682457], "isController": false}, {"data": ["3_select product-931 - /uploads/images/2018/3/fontello.woff2", 25, 0, 0.0, 46.11999999999999, 29, 96, 41.0, 66.00000000000001, 87.89999999999998, 96.0, 0.032546150441325805, 0.46711989554313016, 0.04910781848035514], "isController": false}, {"data": ["1_launch_website-105 - /pinterestConversion", 25, 0, 0.0, 189.07999999999998, 144, 380, 181.0, 225.8, 334.9999999999999, 380.0, 0.028151346141069775, 0.010089398470481062, 0.03708609955498352], "isController": false}, {"data": ["2_selectproduct category-690 - /api/pagecreatorbanner", 25, 0, 0.0, 98.6, 58, 231, 90.0, 141.0, 203.99999999999994, 231.0, 0.03254729447359959, 0.019108821716336006, 0.0470054129405439], "isController": false}, {"data": ["3_select product-880 - /marketing:analytics/getproductdataforanalytics/", 25, 0, 0.0, 48.12, 26, 79, 43.0, 73.0, 77.19999999999999, 79.0, 0.032549158994829894, 0.035327280573099556, 0.04990701519004152], "isController": false}, {"data": ["3_select product-930 - /refrigeration-equipment.html", 25, 0, 0.0, 64.35999999999999, 46, 109, 61.0, 82.40000000000005, 104.79999999999998, 109.0, 0.03254750634025424, 2.278385199005218, 0.0524472551386003], "isController": false}, {"data": ["1_launch_website-103 - /facebookConversion", 25, 0, 0.0, 250.56000000000003, 216, 307, 243.0, 282.8, 301.0, 307.0, 0.028149602752805956, 0.010088773642851353, 0.05374264978685121], "isController": false}, {"data": ["2_selectproduct category-672 - /outlet.html", 25, 0, 0.0, 747.92, 563, 969, 733.0, 940.4, 962.4, 969.0, 0.032524936869097534, 3.189362276244697, 0.054739722851760444], "isController": false}, {"data": ["2_selectproduct category-711 - /PageView", 25, 0, 0.0, 125.16, 75, 210, 116.0, 176.00000000000006, 203.39999999999998, 210.0, 0.03254462519006061, 0.011663942817140864, 0.04331486208889629], "isController": false}, {"data": ["3_select product-828 - /pinterestConversion", 25, 0, 0.0, 204.24000000000004, 143, 384, 195.0, 277.4000000000002, 366.59999999999997, 384.0, 0.03254352370860789, 0.011663548047909273, 0.04341509459751472], "isController": false}, {"data": ["A_launch_website (Outlet)", 22, 0, 0.0, 1932.0, 1751, 2314, 1918.0, 2165.8, 2293.7499999999995, 2314.0, 0.02589956853673324, 3.2988575218380456, 0.36521058850883237], "isController": true}, {"data": ["1_launch_website-99  -/pinterestConversion", 25, 0, 0.0, 71.40000000000002, 52, 176, 66.0, 98.60000000000005, 157.09999999999997, 176.0, 0.028152962930430653, 0.01314171511791587, 0.022626844230219167], "isController": false}, {"data": ["2_selectproduct category-647 - /PageView", 25, 0, 0.0, 81.16000000000001, 51, 264, 69.0, 133.4, 225.89999999999992, 264.0, 0.03254805720646535, 0.011665172846457794, 0.043196103265221095], "isController": false}, {"data": ["3_select product-818 - /", 25, 0, 0.0, 166.00000000000003, 102, 298, 166.0, 232.0, 279.09999999999997, 298.0, 0.03254233758119313, 0.012616511738021165, 0.02764827509339651], "isController": false}, {"data": ["3_select product-826 - /facebookConversion", 25, 0, 0.0, 274.00000000000006, 226, 383, 262.0, 324.4, 365.59999999999997, 383.0, 0.03253789037333975, 0.01166152906935126, 0.06266340121821862], "isController": false}, {"data": ["B_selectproduct category", 25, 0, 0.0, 2488.9999999999995, 2087, 3149, 2460.0, 2868.6000000000004, 3080.0, 3149.0, 0.032461546052546156, 6.5505979741398335, 0.6419220010725294], "isController": true}, {"data": ["2_selectproduct category-704 - /api/shoppingcart/items", 25, 0, 0.0, 120.71999999999998, 76, 204, 116.0, 167.8, 193.49999999999997, 204.0, 0.0325469554926893, 0.050288860332551776, 0.04703670751418071], "isController": false}, {"data": ["2_selectproduct category-709 - /facebookConversion", 25, 0, 0.0, 262.4800000000001, 212, 393, 247.0, 352.8000000000001, 392.1, 393.0, 0.03253810211757968, 0.011661604958156, 0.06275278038082595], "isController": false}, {"data": ["1_launch_website-100 - /PageView", 25, 0, 0.0, 131.32000000000002, 90, 208, 122.0, 199.00000000000003, 208.0, 208.0, 0.028153660426313988, 0.013142040706814536, 0.02232497291617867], "isController": false}, {"data": ["1_launch_website-39 - /uploads/images/2018/3/fontello.woff2", 25, 0, 0.0, 40.199999999999996, 23, 67, 37.0, 63.0, 65.8, 67.0, 0.0281552457727714, 0.4040992647679895, 0.040971381670822385], "isController": false}, {"data": ["C_selectproduct ", 25, 0, 0.0, 2063.72, 1820, 2681, 2029.0, 2324.8, 2601.5, 2681.0, 0.03246285275758949, 5.266060570326875, 0.7383003777215232], "isController": true}, {"data": ["2_selectproduct category-672 - /outlet.html-1", 1, 0, 0.0, 668.0, 668, 668, 668.0, 668.0, 668.0, 668.0, 1.4970059880239521, 157.5057892028443, 2.3946248128742513], "isController": false}, {"data": ["1_launch_website-118 /api/shoppingcart/items", 25, 0, 0.0, 114.68000000000002, 76, 171, 107.0, 164.8, 169.5, 171.0, 0.03254521832634262, 0.05032431513469815, 0.04640236206685569], "isController": false}, {"data": ["1_launch_website-35 - /outlet.html", 25, 0, 0.0, 744.6399999999999, 641, 1082, 709.0, 857.0, 1017.1999999999998, 1082.0, 0.028134301903566864, 2.9601901386458396, 0.042339926372531915], "isController": false}, {"data": ["1_launch_website-51 - /api/pagecreatorbanner", 25, 0, 0.0, 77.28000000000002, 57, 132, 73.0, 94.60000000000002, 122.39999999999998, 132.0, 0.028153438492056787, 0.016509352290732675, 0.03942911055686375], "isController": false}, {"data": ["3_select product-894 - /marketing:analytics/getproductdataforanalytics/", 25, 0, 0.0, 38.35999999999999, 25, 71, 36.0, 53.800000000000004, 66.19999999999999, 71.0, 0.03254869284449537, 0.037284781940032284, 0.050192372946177476], "isController": false}, {"data": ["2_selectproduct category-672 - /outlet.html-0", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 1.690715348639456, 5.503959396258503], "isController": false}, {"data": ["1_launch_website-102 - /PageView", 25, 0, 0.0, 89.28, 46, 475, 68.0, 140.80000000000004, 377.7999999999998, 475.0, 0.028154548198334153, 0.0100905460828014, 0.03571558409144147], "isController": false}, {"data": ["1_launch_website-98 - /facebookConversion", 25, 0, 0.0, 74.36000000000001, 53, 133, 67.0, 130.4, 132.4, 133.0, 0.028154167717755595, 0.013142277508874194, 0.022600318226557715], "isController": false}, {"data": ["3_select product-777 - /api/pagecreatorbanner", 25, 0, 0.0, 77.71999999999998, 61, 118, 76.0, 95.80000000000001, 111.69999999999999, 118.0, 0.032547421593261384, 0.019131781255288957, 0.04732979936141959], "isController": false}, {"data": ["3_select product-803 - /api:edgecache/getdynamicdata/", 25, 0, 0.0, 174.08000000000007, 116, 600, 155.0, 224.8, 487.7999999999997, 600.0, 0.032544879388676985, 0.1047373038357395, 0.05085010276045667], "isController": false}, {"data": ["2_selectproduct category-677 - /uploads/images/2018/3/fontello.woff2", 25, 0, 0.0, 39.599999999999994, 23, 76, 35.0, 65.20000000000003, 75.1, 76.0, 0.03254848096239348, 0.4671508015877149, 0.04878712154253761], "isController": false}, {"data": ["1_launch_website-84 - /api:edgecache/getdynamicdata/", 25, 0, 0.0, 158.68, 124, 216, 149.0, 208.0, 213.6, 216.0, 0.028152233767140485, 0.09067218666282295, 0.039705646577983374], "isController": false}, {"data": ["2_selectproduct category-645 - /pinterestConversion", 25, 0, 0.0, 196.35999999999999, 144, 324, 178.0, 267.6, 308.69999999999993, 324.0, 0.03254386261803659, 0.011663669512518973, 0.042872725265362656], "isController": false}, {"data": ["2_selectproduct category-710 - /pinterestConversion", 25, 0, 0.0, 173.68, 150, 236, 165.0, 215.4, 230.0, 236.0, 0.032543481345425625, 0.011663532865010942, 0.04350402416418577], "isController": false}, {"data": ["3_select product-751 - /outlet/<C_Outlet_Item>.html", 25, 0, 0.0, 252.23999999999998, 69, 434, 242.0, 389.2, 421.09999999999997, 434.0, 0.03254318480623788, 1.7308525053370822, 0.05323098908501581], "isController": false}, {"data": ["3_select product-832 - /marketing:analytics/getproductdataforanalytics/", 25, 0, 0.0, 120.76, 48, 240, 111.0, 197.60000000000005, 231.59999999999997, 240.0, 0.03254013500251209, 0.029954719588640627, 0.0485267474215197], "isController": false}, {"data": ["2_selectproduct category-641 - /api/shoppingcart/items", 25, 0, 0.0, 108.24, 73, 197, 97.0, 156.8, 186.2, 197.0, 0.0325464046637696, 0.0502803811737275, 0.04640405352451525], "isController": false}, {"data": ["2_selectproduct category-644 - /facebookConversion", 25, 0, 0.0, 260.15999999999997, 218, 376, 248.0, 327.80000000000007, 368.2, 376.0, 0.03254055855217943, 0.011662485340478371, 0.06212577340772538], "isController": false}, {"data": ["3_select product-810 - /api/shoppingcart/items", 25, 0, 0.0, 112.64, 76, 213, 97.0, 174.60000000000002, 202.2, 213.0, 0.0325464046637696, 0.05031852149169286, 0.04736010416151348], "isController": false}, {"data": ["2_selectproduct category-702 - /api:edgecache/getdynamicdata/", 25, 0, 0.0, 203.92000000000002, 119, 584, 160.0, 432.8000000000003, 564.1999999999999, 584.0, 0.03254517595874834, 0.10470266198384978, 0.0497674220022313], "isController": false}, {"data": ["3_select product-756 - /uploads/images/2018/3/fontello.woff2", 25, 0, 0.0, 36.16, 24, 62, 35.0, 50.60000000000003, 61.099999999999994, 62.0, 0.03254898948407248, 0.46716064301505195, 0.04911210221879952], "isController": false}, {"data": ["2_selectproduct category-731 - /restaurant-equipment.html", 25, 0, 0.0, 71.0, 53, 122, 68.0, 95.2, 114.49999999999999, 122.0, 0.03254716735493077, 2.6148241688104403, 0.05202715556634675], "isController": false}, {"data": ["3_select product-831 - /PageView", 25, 0, 0.0, 91.60000000000001, 48, 273, 79.0, 140.2000000000001, 240.89999999999992, 273.0, 0.03254593859232307, 0.011664413538459536, 0.04385946623033412], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 977, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
