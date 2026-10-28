const draggableElement = document.querySelectorAll('.box');
const droppableElement = document.querySelectorAll('.droppable');


draggableElement.forEach(element=>{

    element.addEventListener('dragstart',(dragStart)=>{
        
        dragStart.dataTransfer.setData('text', dragStart.target.id);
       // console.log('dragstart event is activated!');
        console.log('dragStart');
    });
});