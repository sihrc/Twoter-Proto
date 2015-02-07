console.log("Loaded Javascript");

$("form#addTwote").submit(function (event) {
    event.preventDefault();

    var $input = $("input#messageInput");
    $.post("/addTwote", {message: $input.val()}).done(function (data) {
        var add_ = data.author + " @ " + data.displayTime + "<br>&nbsp;&nbsp;" + data.message + "<br><br>";
        $("div#list").prepend(add_);
        $input.val("");
    });
});