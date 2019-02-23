require([
    'dojo/dom',
    'dojo/on',
    'dojo/_base/fx',
    'dojo/dom-style',
    'dojo/mouse',
    'dojo/domReady!'
], function (dom, on, fx, domStyle, mouse) {

    var player1Name = "";
    var player2Name = "";

    var player1InputDiv = dom.byId('player1InputDiv');
    var player1Input = dom.byId('player1Input');
    var player1Text = dom.byId('player1Text');
    var player1Button = dom.byId('player1Button');

    on(player1Input, 'change', function(e) {
        player1Name = e.target.value;
    });
    on(player1Button, 'click', function(e) {
        if(player1Name.length === 0) {
            player1Name = player1Input.placeholder;            
        }
        player1Text.innerHTML = player1Name;
        fx.fadeOut({ node: player1InputDiv}).play();
        fx.fadeIn({ node: player1Text}).play();
    });

    on(player2Input, 'change', function(e) {
        player2Name = e.target.value;
    });
    on(player2Button, 'click', function(e) {
        if(player2Name.length === 0) {
            player2Name = player2Input.placeholder;            
        }
        player2Text.innerHTML = player2Name;
        fx.fadeOut({ node: player2InputDiv}).play();
        fx.fadeIn({ node: player2Text}).play();
    });

});