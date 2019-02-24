require([
    'dojo/dom',
    'dojo/on',
    'dojo/query',
    'dojo/dom-class',
    'dojo/_base/fx',
    'dojo/dom-style',
    'dojo/mouse',
    'dojo/domReady!'
], function (dom, on, query, domClass, fx, domStyle, mouse) {

    var player1Name = "";
    var player2Name = "";
    var player1Symbol = "X";
    var player2Symbol = "O";
    var changePlayer = false;
    var session = sessionStorage;

    var player1InputDiv = dom.byId('player1InputDiv');
    var player1Input = dom.byId('player1Input');
    var player1Text = dom.byId('player1Text');
    var player1Button = dom.byId('player1Button');
    var cells = query('div.grid-cell');
    var grid = dom.byId('grid');

    console.log('ready');
    session.clear();

    if(!session.getItem('gameStarted')){
        session.setItem('gameStarted', 'started');
    }    

    var showGrid = function(){
        if(player1Name.length > 0 && player2Name.length > 0){
            domClass.remove('grid', 'hidden');
        }
    }

    on(player1Input, 'change', function(e){
        player1Name = e.target.value;
    });
    on(player1Button, 'click', function(e){
        if(player1Name.length === 0) {
            player1Name = player1Input.placeholder;            
        }
        player1Text.innerHTML = player1Name;
        session.setItem(player1Text.id, player1Name);
        fx.fadeOut({ node: player1InputDiv}).play();
        showGrid();
    });

    on(player2Input, 'change', function(e){
        player2Name = e.target.value;
    });
    on(player2Button, 'click', function(e){
        if(player2Name.length === 0) {
            player2Name = player2Input.placeholder;            
        }
        player2Text.innerHTML = player2Name;
        session.setItem(player2Text.id, player2Name);
        fx.fadeOut({ node: player2InputDiv}).play();
        showGrid();
    });    

    cells.on('click', function(e){
        if(e.target.innerHTML === "") {
            if(!changePlayer) {
                e.target.innerHTML = player1Symbol;
            } else {
                e.target.innerHTML = player2Symbol;
            }
            changePlayer = !changePlayer;
        }        
    });

    cells.on(mouse.enter, function(e){
        domClass.add(e.target.id, 'grid-cell-hover');      
    });

    cells.on(mouse.leave, function(e){
        domClass.remove(e.target.id, 'grid-cell-hover');        
    });



});