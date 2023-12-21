let canwrap = document.getElementById('editorWrap');
let canvas = document.getElementById('targetCanvas');
let cvs = canvas.getContext('2d');
let colSel = document.getElementById('colorSelector');
let bitsel = document.getElementById('imgBit');

let bittage = 32;
let canvas_dim;
let local_block = [];
let px_rt;
let colour;



// build the array to hold local for redraws
const initArr = () => {
    local_block = [];
    px_rt = cvs.canvas.width / bittage;
    for (let i = 0; i < bittage; i++) {
        let row = []
        for (let j = 0; j < bittage; j++) {
            let bit = {
                location: { x: 0, y: 0 },
                pix_loc: { },
                colour: null,
                width: px_rt
            }
            bit.location.x = j;
            bit.location.y = i;
            bit.pix_loc.xstart = j *px_rt;
            bit.pix_loc.ystart = i*px_rt;
            bit.pix_loc.xend = bit.pix_loc.xstart + px_rt;
            bit.pix_loc.yend = bit.pix_loc.ystart + px_rt;
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
    cvs.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < bittage; i++) {
        for (let j = 0; j < bittage; j++) {
            let thisPix = local_block[i][j]
            let myposx = thisPix.pix_loc.xstart;
            let myposy = thisPix.pix_loc.ystart;
            let myposxend = thisPix.pix_loc.xend;
            let myposyend = thisPix.pix_loc.yend;
            cvs.beginPath();
            cvs.rect(myposx, myposy, myposxend, myposyend)
            cvs.stroke()
        };
    };
}
//draw cell
const drawCell = (x,y) => {
    let thisPix = local_block[y][x];
    console.log(thisPix);
    cvs.rect(thisPix.pix_loc.xstart, thisPix.pix_loc.ystart, thisPix.width, thisPix.width);
    cvs.fillStyle = colour;
    cvs.fill()
}

// handle canvas click
const handleCanvasClick = (e) => {
    let pix_wid = cvs.canvas.width / bittage;
    colour = colSel.value;
    x = Math.floor(e.offsetX/pix_wid);
    y = Math.floor(e.offsetY/pix_wid);
    local_block[y][x].colour = colour;
    console.log(`x,y ${x},${y} colour:${colour}`);
    drawCell(x,y);
}




// start
const init = () => {
    resizeCanvas();
    initArr();
    drawGrid();
};
window.onload = init;
// listener dump 
window.addEventListener('resize', () => {
    console.log('resize');
    resizeCanvas();
})
canvas.addEventListener('mousedown', handleCanvasClick)
document.getElementById('dlBtn').addEventListener('click', () => {
    console.log('open modal');
    document.getElementById('downloadModal').style.display = 'flex'
});
document.getElementById("closeModal").addEventListener('click', () => {
    console.log('close modal')
    document.getElementById('downloadModal').style.display = 'none'
});
colSel.addEventListener('change', ()=>{
    colour = colSel.value;
})
bitsel.addEventListener('change', (e)=>{
    console.log('bittage change')
    bittage = e.target.value;
    init()
})