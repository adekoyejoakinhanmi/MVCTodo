/*jslint nomen:true*/
/*global
    console, __
*/
(function () {
    'use strict';
    /*
    - How I intend for this branch to work
    * The Model/Store will keep track of the Data with the following methods - 
        * init
        * create
        * save
        * find
    * The View will manage the DOM like so -
        * init
        * removeEl
        * renderOne
        * renderAll
    * The Controller will glue the above by -
        * init and binding
    */
    var _ = document.querySelector.bind(document),
        todoList = {};
    
}());