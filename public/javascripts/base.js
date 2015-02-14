
/* Delete Twote */
var deleteTwote = function () {
    $("button.deleteTwote").click(function (event) {
        var $elem = $(event.target);
        $.post('/deleteTwote', {id: $elem.attr('id')}).done(function (data) {
            $elem.parent().remove();
        });
    });
}

deleteTwote();

/* Adding Twote **/
$("form#addTwote").submit(function (event) {
    event.preventDefault();

    var $input = $("input#messageInput");
    $.post("/addTwote", {
        message: $input.val()
    }).done(function (data) {
        var $existing = $('div.' + data.author);
        var add_ = data.author + " @ " + data.displayTime + "<br>&nbsp;&nbsp;" + data.message + '<br><br> <button class = "deleteTwote" id = ' + data._id + '> Delete </button>';
        var classes = data.authorId;
        if ($existing.length) {
            classes = $existing[0].className;
        }
        $("div#list").prepend('<div class="' + classes + ' id = "' + data._id + '"">' + add_ + "</div>");
        $input.val("");
        deleteTwote();
    });
});


/* selecting users */
$("a.toggleUser").click(function (event) {
    $(this).toggleClass("toggleUserDown");
    var $current = $(event.target);

    $("div." + $current.attr('id')).toggleClass("toggleUserDown");
});

/* logout */
$('button#logout').click(function (event) {
    if (confirm("Logout?")) {
        $.post('/logout').done(function (data) {
            window.location="/";
        });
    }
});