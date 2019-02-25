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

    var player1Name = "",
        player2Name = "",
        player1Symbol = "X",
        player2Symbol = "O",
        changePlayer = false,
        session = sessionStorage,
        lastCellChanged = "",
        cellsHoverHandle = {},
        cellsLeaveHandle = {};

    var player1InputDiv = dom.byId('player1InputDiv'),
        player1Input = dom.byId('player1Input'),
        player1Text = dom.byId('player1Text'),
        player1Button = dom.byId('player1Button'),
        player2InputDiv = dom.byId('player2InputDiv'),
        player2Input = dom.byId('player2Input'),
        player2Text = dom.byId('player2Text'),
        player2Button = dom.byId('player2Button'),
        cells = query('div.grid-cell'),
        grid = dom.byId('grid'),
        statusBar = dom.byId('statusBar'),
        statusText = dom.byId('statusText'),
        againButton = dom.byId('againButton'),
        newGameButton = dom.byId('newGameButton');

    if(session.getItem(player1Text.id)){
        player1Name = session.getItem(player1Text.id);
        hidePlayer1Input();
    }

    if(session.getItem(player2Text.id)){
        player2Name = session.getItem(player2Text.id);
        hidePlayer2Input();
    }   

    function hidePlayer1Input(){
        player1Text.innerHTML = player1Name;
        fx.fadeOut({ node: player1InputDiv}).play();
        showGrid();
    }

    function hidePlayer2Input(){
        player2Text.innerHTML = player2Name;
        fx.fadeOut({ node: player2InputDiv}).play();
        showGrid();
    }

    function showGrid(){
        if(player1Name.length > 0 && player2Name.length > 0){
            domClass.remove(grid.id, 'hidden');
        }
        domStyle.set(player1Text, 'font-size', '32px');
    }

    if(session.getItem('changePlayer')){
        changePlayer = JSON.parse(session.getItem('changePlayer'));        
        if(!changePlayer) {
            domStyle.set(player2Text, 'font-size', '24px');
            domStyle.set(player1Text, 'font-size', '32px');
        } else {
            domStyle.set(player1Text, 'font-size', '24px');
            domStyle.set(player2Text, 'font-size', '32px');
        }
    }

    if(session.getItem('started')){
        for(let i=0; i<9; i++){
            var key = `cell${(i+1)}`;
            if(session[key]){
                dom.byId(key).innerHTML = session[key];
            }
        }
    }

    if(session.getItem('status')){
        statusText.innerHTML = session.getItem('status');
        if(statusText.innerHTML){
            domClass.remove(statusBar.id, 'hidden'); 
        }
    }

    on(player1Input, 'change', function(e){
        player1Name = e.target.value;
    });
    on(player1Button, 'click', function(e){
        if(player1Name.length === 0) {
            player1Name = player1Input.placeholder;            
        }
        session.setItem(player1Text.id, player1Name);
        hidePlayer1Input();
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
        hidePlayer2Input();
    });    

    cells.on('click', function(e){
        if(e.target.innerHTML === "" && statusText.innerHTML === "") {
            if(!changePlayer) {
                e.target.innerHTML = player1Symbol;
                domStyle.set(player1Text, 'font-size', '24px');
                domStyle.set(player2Text, 'font-size', '32px');
            } else {
                e.target.innerHTML = player2Symbol;
                domStyle.set(player2Text, 'font-size', '24px');
                domStyle.set(player1Text, 'font-size', '32px');
            }
            changePlayer = !changePlayer;
            session.setItem('changePlayer', changePlayer);
            session.setItem(e.target.id, e.target.innerHTML);
            session.setItem('started', true);
            lastCellChanged = e.target.id;
            checkWinner();
        }        
    });

    on(againButton, 'click', function(e){
        statusText.innerHTML = "";
        session.removeItem('status');
        domClass.add(statusBar.id, 'hidden');
        cells.forEach(e => {
            e.innerHTML = "";
            domClass.remove(e, 'grid-cell-hover');
        }); 
        if(session.getItem('started')){
            for(let i=0; i<9; i++){
                session[`cell${(i+1)}`] = "";
            }
        }
        addHoverEffect(); 
        session.removeItem('started');
    });

    on(newGameButton, 'click', function(e){
        statusText.innerHTML = "";        
        domClass.add(statusBar.id, 'hidden');
        domClass.add(grid.id, 'hidden');
        cells.forEach(e => {
            e.innerHTML = "";
            domClass.remove(e, 'grid-cell-hover');
        }); 
        player1Text.innerHTML = "";
        player1Name = "";
        fx.fadeIn({ node: player1InputDiv}).play();
        player2Text.innerHTML = "";
        player2Name = "";
        fx.fadeIn({ node: player2InputDiv}).play();
        addHoverEffect(); 
        session.clear();        
    });

    function addHoverEffect(){
        cellsHoverHandle = cells.on(mouse.enter, function(e){
            domClass.add(e.target.id, 'grid-cell-hover');      
        });
        cellsLeaveHandle = cells.on(mouse.leave, function(e){
            domClass.remove(e.target.id, 'grid-cell-hover');        
        });
    } 
    addHoverEffect();   

    function checkWinner(){
        if(checkPlayerWin(player1Symbol)){
            statusText.innerHTML = `Winner ${player1Name}!`;
        }
        if(checkPlayerWin(player2Symbol)){
            statusText.innerHTML = `Winner ${player2Name}!`;            
        }

        var draw = true;
        cells.forEach(e => {
            if(e.innerHTML.length === 0) draw = false;
        });
        if(draw){
            statusText.innerHTML = 'Draw!';
            domClass.remove(statusBar.id, 'hidden'); 
            cellsHoverHandle.remove();
            cellsLeaveHandle.remove();
        }
        session.setItem('status', statusText.innerHTML);
    }

    function checkPlayerWin(symbol){
        var line1 = false,  
            line2 = false,  
            line3 = false,  
            line4 = false,  
            line5 = false,  
            line6 = false,  
            line7 = false,  
            line8 = false;

        if(dom.byId('cell1').innerHTML === symbol && dom.byId('cell2').innerHTML === symbol && dom.byId('cell3').innerHTML === symbol){
            domClass.add('cell1', 'grid-cell-hover'); 
            domClass.add('cell2', 'grid-cell-hover'); 
            domClass.add('cell3', 'grid-cell-hover'); 
            line1 = true;
        }
        if(dom.byId('cell4').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell6').innerHTML === symbol){
            domClass.add('cell4', 'grid-cell-hover'); 
            domClass.add('cell5', 'grid-cell-hover'); 
            domClass.add('cell6', 'grid-cell-hover'); 
            line2 = true;
        }
        if(dom.byId('cell7').innerHTML === symbol && dom.byId('cell8').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol){
            domClass.add('cell7', 'grid-cell-hover'); 
            domClass.add('cell8', 'grid-cell-hover'); 
            domClass.add('cell9', 'grid-cell-hover'); 
            line3 = true;
        }
        if(dom.byId('cell1').innerHTML === symbol && dom.byId('cell4').innerHTML === symbol && dom.byId('cell7').innerHTML === symbol){
            domClass.add('cell1', 'grid-cell-hover'); 
            domClass.add('cell4', 'grid-cell-hover'); 
            domClass.add('cell7', 'grid-cell-hover'); 
            line4 = true;
        }
        if(dom.byId('cell2').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell8').innerHTML === symbol){
            domClass.add('cell2', 'grid-cell-hover'); 
            domClass.add('cell5', 'grid-cell-hover'); 
            domClass.add('cell8', 'grid-cell-hover'); 
            line5 = true;
        }  
        if(dom.byId('cell3').innerHTML === symbol && dom.byId('cell6').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol){
            domClass.add('cell3', 'grid-cell-hover'); 
            domClass.add('cell6', 'grid-cell-hover'); 
            domClass.add('cell9', 'grid-cell-hover'); 
            line6 = true;
        } 
        if(dom.byId('cell1').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell9').innerHTML === symbol){
            domClass.add('cell1', 'grid-cell-hover'); 
            domClass.add('cell5', 'grid-cell-hover'); 
            domClass.add('cell9', 'grid-cell-hover'); 
            line7 = true;
        } 
        if(dom.byId('cell3').innerHTML === symbol && dom.byId('cell5').innerHTML === symbol && dom.byId('cell7').innerHTML === symbol){
            domClass.add('cell3', 'grid-cell-hover'); 
            domClass.add('cell5', 'grid-cell-hover'); 
            domClass.add('cell7', 'grid-cell-hover'); 
            line8 = true;
        } 

        if (line1 || line2 || line3 || line4 || line5 || line6 || line7 || line8){
                domClass.remove(statusBar.id, 'hidden'); 
                cellsHoverHandle.remove();
                cellsLeaveHandle.remove();
                return true;
            } else {
                return false;
            }
    }

});