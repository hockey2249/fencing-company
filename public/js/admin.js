$(function(){

$('.list-group').delegate('.approve-button', 'click', function(e) {
	e.preventDefault();
	const link = $(this);
	const url = $(this).attr('href');
		$.ajax({
			url: url,
			method: 'get',
			success: function(data){
				if (data._id){
					const parent = link.closest('.review-post');
					parent.remove();

				}
			}
		});
});


});
