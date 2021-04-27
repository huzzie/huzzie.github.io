var column_names = ["Attrition_Flag","Customer_Age","Gender","Dependent_count","Education_Level","Marital_Status","Income_Category","Card_Category","Months_on_book","Total_Relationship_Count","Months_Inactive_12_mon","Contacts_Count_12_mon","Credit_Limit","Total_Revolving_Bal","Avg_Open_To_Buy","Total_Amt_Chng_Q4_Q1","Total_Trans_Amt","Total_Trans_Ct","Total_Ct_Chng_Q4_Q1","Avg_Utilization_Ratio" ]
var clicks = {"attrition_Flag": 0,"customer_Age": 0,"gender": 0,"dependent_count": 0,"education_Level": 0,"marital_Status": 0,"income_Category": 0,"card_Category":0 ,"months_on_book": 0,"total_Relationship_Count": 0 ,"months_Inactive_12_mon": 0 ,"contacts_Count_12_mon": 0 ,"credit_Limit": 0 ,"total_Revolving_Bal": 0 ,"avg_Open_To_Buy": 0,"total_Amt_Chng_Q4_Q1": 0 ,"total_Trans_Amt": 0 ,"total_Trans_Ct": 0 ,"total_Ct_Chng_Q4_Q1": 0,"avg_Utilization_Ratio": 0}

// draw the table

/*
var tabulate = function (data,columns) {
    var table = d3.select('#my_table').append('table')
      var thead = table.append('thead')
      var tbody = table.append('tbody')
  
      thead.append('tr')
        .selectAll('th')
          .data(columns)
          .enter()
        .append('th')
          .text(function (d) { return d })
  
      var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
        .append('tr')
  
      var cells = rows.selectAll('td')
          .data(function(row) {
              return columns.map(function (column) {
                  return { column: column, value: row[column] }
            })
        })
        .enter()
      .append('td')
        .text(function (d) { return d.value })
  
    return table;
  }


  d3.csv('data/BankChurners.csv').then(function(data){
      var columns = ["CLIENTNUM","Attrition_Flag","Customer_Age","Gender","Dependent_count","Education_Level","Marital_Status","Income_Category","Card_Category","Months_on_book","Total_Relationship_Count","Months_Inactive_12_mon","Contacts_Count_12_mon","Credit_Limit","Total_Revolving_Bal","Avg_Open_To_Buy","Total_Amt_Chng_Q4_Q1","Total_Trans_Amt","Total_Trans_Ct","Total_Ct_Chng_Q4_Q1","Avg_Utilization_Ratio" ]
      tabulate(data,columns)
  })
*/


d3.select('body').append('div')
  .attr('id', 'container')

d3.select('#container').append('div')
  .attr('id', 'FilterableTable')

d3.select('#FilterableTable').append('h1')
  .attr('id', 'title')
  .text('Data')

d3.select('#FilterableTable').append('div')
  .attr('class', 'SearchBar')
  .append('p')
    .attr('class', 'SearchBar')
    .text('Title');

d3.select('.SearchBar')
  .append('input')
    .attr('class', 'SearchBar')
    .attr('id', 'search')
    .attr('type', 'text')
    .attr('placeholder', 'Type your key word..')



var rows, row_entries, row_entries_no_anchor, row_entries_with_anchor;

d3.csv('data/BankChurners.csv').then(function(data){
    //var table = d3.select('#my_table').append('table')

    var table = d3.select('#FilterableTable').append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    var headers = table.select('tr').selectAll('th')
        .data(column_names)
        .enter()
        .append('th')
        .text(function(d) { return d;})



    thead.append('tr')
        .selectAll('th')
            .data(column_names)
            .enter()
        .append('th')
            .text(function (d) { return d})

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr')


    var cells = rows.selectAll('td')
        .data(function(row) {
            return column_names.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value });

    d3.select('#search')
        .on('keyup', function() {
            var searched_data = data,
            text = this.value.trim();

            var searchResults = searched_data.map(function(r) { 
                var regex = new RegExp('^' + text + '.*', 'i');
                if (regex.test(r.Attrition_Flag)) {
                    return regex.exec(r.Attrition_Flag)[0];
                }
            })

        // filter blank entries from searchResults
        searchResults = searchResults.filter(function(r) {
            return r != undefined;
        })

        searched_data = searchResults.map(function(r) {
            return data.filter(function(p) {
                return p.Attrition_Flag.indexOf(r) != -1 ;
            })
        })


        })
    
    // sort functionality
    headers
        .on('click', function(d) {
            if ( d == 'Education_Level'){
                clicks.education_Level ++;
                // even number of clicks
                if (clicks.title % 2 == 0){
                    rows.sort(function(a, b) {
                        if (a.education_Level.topUpperCase() < b.education_Level.toUpperCase()){
                            return -1 ;
                        } else if (a.education_Level.toUpperCase() > b.education_Level.toUpperCase()) {
                            return 1;
                        } else { 
                            return 0;
                        }
                    });
                } else if (clicks.title % 2 != 0) {
                    rows.sort(function(a, b){ 
                        if (a.education_Level.toUpperCase() < b.education_Level.toUpperCase()) {
                            return 1;
                        } else if (a.education_Level.toUpperCase() > b.education_Level.toUpperCase()) {
                            return -1;
                        } else{
                            return 0;
                        }
                    })
                }
            }
        if (d == 'Dependent_count') {
            clicks.views++;
            if (clicks.views % 2 == 0) {
                rows.sort(function(a,b) {
                    if (+a.views < +b.views) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            } else if (clicks.views % 2 != 0) {
                rows.sort(function(a, b) {
                    if (+a.views < + b.views) {
                        return 1;
                    } else if (+a.views > +b.views) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            }
        }
        })



    return table;

})