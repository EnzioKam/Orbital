function saveSelected(){
  var table = document.querySelector('table');
  var arr = new Array;

  for (var i=1; i<table.rows.length; i++){
    if (table.rows[i].cells[0].firstElementChild.checked == false){
      continue;
    }
    var temp = new Array;
    for (var j=1; j<table.rows[i].cells.length; j++){
      temp.push(table.rows[i].cells[j].textContent)
    }

    arr.push(temp);
  }

  var stored = localStorage.getItem('selected_mappings');
  if (stored == "undefined" || stored == null){
    var data = JSON.stringify(arr);
    localStorage.setItem('selected_mappings', data);
  }
  else{
    var stored_arr = JSON.parse(stored);
    var len = arr.length 

    for (var k=0; k<len; k++){
      if (checkContains(stored_arr, arr[k]) == false){
        stored_arr.push(arr[k]);
      }
    }

    var comb_data = JSON.stringify(stored_arr);
    localStorage.setItem('selected_mappings', comb_data);
  }
  if (arr.length == 0){
    M.toast({html: "You have not selected any modules", 
      classes: 'alert'});
  }
  else{
    M.toast({html: "Your selected modules have been saved",
      classes: 'alert'});
  }
}

function selectAll() {
  var text = document.getElementById('select-all').innerHTML.trim();
  var cond = (text == 'Select all<i class="material-icons right">select_all</i>');
  var table = document.querySelector('table');
  var checkboxes =  document.querySelectorAll("input.filled-in")
  var selected = false;

  for (i = 0; i < checkboxes.length; i++){
    if (cond && table.rows[i+1].classList.contains('hidden') == ""){
      checkboxes[i].checked = true;
      selected = true;
    }
    else if (!cond && table.rows[i+1].classList.contains('hidden') == ""){
      checkboxes[i].checked = false;
    }
    else{
      continue;
    }
  }
  if (cond && selected){
    document.getElementById('select-all').innerHTML 
      = 'Unselect all<i class="material-icons right">clear</i>';
  }
  else{
    document.getElementById('select-all').innerHTML 
      = 'Select all<i class="material-icons right">select_all</i>';
  }

}


//Filtering functions
$(document).ready(function(){

  $("#id_pu_name").on("keyup", function() {
    var search = $(this).val().toUpperCase();
    if (!search && !$("#id_pu_name").val()){
      $("#tabledata tr").addClass('hidden');
    }
    else{
      $("#tabledata tr").removeClass('hidden').filter(function() {
        return !($(this).find('.pu-name').text().toUpperCase().indexOf(search) > -1);
      }).addClass('hidden');
    }
  });

  $("#id_general").on("keyup", function() {
    var search = $(this).val().toUpperCase();
    if (!search && !$("#id_general").val()){
      $("#tabledata tr").addClass('hidden');
    }
    else{
      $("#tabledata tr").removeClass('hidden').filter(function() {
        return !($(this).text().toUpperCase().indexOf(search) > -1);
      }).addClass('hidden');
    }
  });  

});