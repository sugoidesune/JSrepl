function hideNavbar (){
    $('#sidebar').removeClass('active');
    $('.overlay').fadeOut();
}
function showNavbar (){
    $('#sidebar').addClass('active');
    $('.overlay').fadeIn();
}

function projectName(string=false){
    if(string){
        document.querySelector('#projectName').value = string;
    }

    return string ? string : document.querySelector('#projectName').value
}

var projectNameValue = document.querySelector('#projectName').value

function newProject(){
    editor.setValue("")
    setProjectName("")
}
    $(document).ready(function () {
        // $("#sidebar").mCustomScrollbar({
        //     theme: "minimal"
        // });

        $('.overlay').on('click', function () {
            hideNavbar();
        });

        $('#listProjects').on('click', function () {
            showNavbar();
        });
        listProjects();//Load and List Projects inside Navbar
    });




    ////////////// File Upload
    var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = "LOVE";//label.innerHTML;;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});