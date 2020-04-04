$(document).ready(function() {

    $("#lblRadius").html(550)
    $("#radius").val(550)
    $('#radius').on('change', function() {
        $("#lblRadius").html($(this).val())
    })
})