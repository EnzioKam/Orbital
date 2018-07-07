function createContainer(pu_name, data){

  var table = document.createElement('table');
  $(table).addClass('responsive-table striped');


  var pos_rel = document.createElement('div');
  $(pos_rel).addClass('position-relative');
  $(pos_rel).addClass('table-container');

  var container = document.createElement('div');
  $(container).addClass('container');
  $(container).addClass('position-relative');

  var nus_cred = 0;
  var pu_cred = 0;
  for (n=0; n<data.length; n++){
    nus_cred += Number(data[n][1]);
    pu_cred += Number(data[n][5]);
  }

  var nusc = nus_cred.toString();
  var puc = pu_cred.toString();

  $(container).append(
    '<div class="pu-header" style="font-weight:bold">' + 
      '<div class="card horizontal teal lighten-2">' +
        '<div class="card-stacked">' + 
          '<div class="card-content">' + 
          '<p>'+ pu_name + '</p>' +
          '<p>' + '<font size="3">' + 'Total NUS MCs: ' + nusc + '</p>' + '</font>' +
          '<p>' + '<font size="3">' + 'Total PU Credits: ' + puc + '</p>' + '</font>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>');


  $(container).append('<br>');
  $(container).append(
    '<button class="btn wave-effect wave-light selector" type="button">Select all<i class="material-icons right">select_all</i> </button>');
  $(container).append(
    '<button class="btn wave-effect wave-light deletor" type="button">Delete selected<i class="material-icons right">delete_forever</i> </button>');

  container.appendChild(table);
  pos_rel.appendChild(container);
  $(pos_rel).attr('id', pu_name);

  document.body.appendChild(pos_rel);

  $(table).append('<thead class="grey darken-3"></thead>');

  thead = table.firstChild;

  var arr = ['Select', 'NUS Code', 'NUS Credits', 'PU Name', 'PU Code',
    'PU Title',  'PU Credits'];
  for (var i = 0; i < arr.length; i++) {
    var th = document.createElement('th');
    var node = document.createTextNode(arr[i]);
    th.appendChild(node);
    thead.appendChild(th);
  }

  for (var i=0; i<data.length; i++){
    var row = table.insertRow(-1)
    row.className = "modlist-row"

    td = document.createElement('td')
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "filled-in";
    var box_id = pu_name + String(i);
    checkbox.setAttribute('id', box_id)
    td.appendChild(checkbox);

    label = document.createElement('label');
    label.htmlFor = box_id;
    td.appendChild(label);
    
    row.appendChild(td);

    var cell = row.insertCell(-1);
    cell.textContent = data[i][0];
    cell.className = "modal-trigger";
    var link = '#modal' + pu_name + data[i][3];
    cell.setAttribute("href", link);
    createModal(link, data[i][0]);

    for (var j=1; j<data[i].length; j++){
      var cell = row.insertCell(-1);
      cell.textContent = data[i][j];
    }
  }

}

function createModal(link, mod_code){
  var modal = document.createElement('div');
  modal.id = link.substring(1);
  modal.className = "modal";
  $(modal).append(
    '<div class="modal-content">' +
      '<h4>' + mod_code + '</h4>' +
    '</div>' );
  $('#modals-container').append(modal);
}


function getData(){
  var strData = localStorage.getItem('selected_mappings');
  var data;
  if (strData == null || strData == 'undefined' || strData == "[]"){
    return;
  }
  else{
    data = JSON.parse(strData);
  }

  var id = data[0][2];
  var curr = [];
  for (var x=0; x<data.length; x++){
    if (data[x][2] == id){
      curr.push(data[x]);
    }
    else{
      createContainer(id, curr);
      curr = [];
      curr.push(data[x]);
      id = data[x][2];
    }
  }
  createContainer(id, curr);

}


$(document).ready(function(){

  $('#download-button').click(function(){
    var data = localStorage.getItem('selected_mappings');
    var arr = JSON.parse(data);
    if (!arr || arr.length == 0){
       M.toast({html: 
        "You have no modules selected. Go back to the previous page to Select some modules.", 
        classes: 'alert'});
       return;
    }

    var compositeCSV = "NUS Code,NUS Credits,PU Name,PU Code,PU Title,PU Credits";
    var pu_name;
    for (var i = 0; i < arr.length; i++) {
      if (!pu_name || pu_name != arr[i][2].replace(";", " ")){
        pu_name = arr[i][2].replace(";", " ");
        compositeCSV += "\n\n" + pu_name;
      }

      compositeCSV += "\n";      
      for (var j = 0; j < arr[i].length; j++){
        var cell = arr[i][j].replace(";", " ");
        compositeCSV += cell + ",";
      }
    }

    var filename = "mappings.csv"
    var content =  "data:text/csv;charset=utf-8," + encodeURIComponent(compositeCSV);
    $(this).attr("href", content).attr("download", filename);

  });

});
