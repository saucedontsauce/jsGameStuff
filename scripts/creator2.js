let canwrap = document.getElementById('editorWrap');
let canvas = document.getElementById('targetCanvas');
let cvs = canvas.getContext('2d');
let colSel = document.getElementById('colorSelector');
let bitsel = document.getElementById('imgBit');
let gridSel = document.getElementById('gridSelector');

let bittage = 32;
let canvas_dim;
let local_block = [];




// build the array to hold local for redraws
const initArr = () => {
    local_block = [];
    for (let i = 0; i < bittage; i++) {
        let row = []
        for (let j = 0; j < bittage; j++) {
            let bit = {
                location: { x: 0, y: 0 },
                colour: undefined,
            }
            row.push(bit);
        }
        local_block.push(row)
    }
    console.log(local_block)
}



// canvas size adjustment
const resizeCanvas = () => {
    if (window.innerWidth > window.innerHeight) {
        let niceFit = window.innerHeight * 0.7;
        canvas.style.width = niceFit + "px";
        cvs.canvas.width = niceFit
    }
    if (window.innerHeight > window.innerWidth) {
        let niceFit = window.innerWidth * 0.7;
        canvas.style.width = niceFit + "px";
        cvs.canvas.width = niceFit
    }
    canvas.height = canvas.width;
    cvs.canvas.height = canvas.height
    canvas_dim = canvas.offsetWidth;
    document.getElementById('createNav').style.width = canvas.offsetWidth + 'px';
}


// draw grid 

const drawGrid = () => {
    cvs.clearRect(0, 0, cvs.canvas.width, cvs.canvas.height);
    for (let i = 0; i < bittage; i++) {
        for (let j = 0; j < bittage; j++) {
            let thisPix = local_block[i][j]
            let pixel_width = cvs.canvas.width / bittage;
            let xstart = j * pixel_width;
            let ystart = i * pixel_width;
            if (gridSel.checked == true) {
                cvs.beginPath();
                cvs.rect(xstart, ystart, pixel_width, pixel_width)
                cvs.stroke()
            } 
             if (thisPix.colour != undefined){
                cvs.beginPath();
                cvs.rect(xstart, ystart, pixel_width, pixel_width);
                cvs.fillStyle = thisPix.colour;
                cvs.fill()
            }

        };
    };
}



// handle canvas click
const handleCanvasClick = (e) => {
    let pix_wid = cvs.canvas.width / bittage;
    x = Math.floor(e.offsetX / pix_wid);
    y = Math.floor(e.offsetY / pix_wid);
    local_block[y][x].colour = colSel.value;
    console.log(local_block[y][x]);
    console.log(colSel.value)
    console.log(`x,y ${x},${y} colour:${local_block[y][x].colour}`);
    reinit();
}




// start
const init = () => {
    console.log('init called');
    cvs.clearRect(0, 0, cvs.canvas.width, cvs.canvas.height)
    console.log('canvas cleared');
    resizeCanvas();
    initArr();
    drawGrid();
};
const reinit = ()=>{
    console.log('reinit called');
    cvs.clearRect(0, 0, cvs.canvas.width, cvs.canvas.height)
    console.log('canvas cleared');
    resizeCanvas();
    drawGrid();
}
window.onload = init;
// listener dump 
window.addEventListener('resize', reinit)
canvas.addEventListener('mousedown', handleCanvasClick)
document.getElementById('dlBtn').addEventListener('click', () => {
    console.log('open modal');
    document.getElementById('downloadModal').style.display = 'flex'
});
document.getElementById("closeModal").addEventListener('click', () => {
    console.log('close modal');
    document.getElementById('downloadModal').style.display = 'none';

});

colSel.addEventListener('change', () => {
    colour = colSel.value;
})
bitsel.addEventListener('change', (e) => {
    console.log('bittage change')
    bittage = e.target.value;
    init()
})

gridSel.addEventListener('change', reinit)
