
window.addEventListener('load', () => {
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    const colors = document.querySelectorAll('.color')
    const picker = document.querySelector('.color-picker')
    const range = document.querySelector('.range')
    const clear = document.querySelector('.clear')
    const undo = document.querySelector('.undo')
    const redo = document.querySelector('.redo')
    const erase = document.querySelector('.erase')
    const bg = document.querySelector('.bg')

    canvas.height = 0.77 * window.innerHeight
    canvas.width = 0.8 * window.innerWidth

    let bgColor = 'white'
    let penColor = 'black'
    let penWidth = '3'
    let flag = false

    let undoArray = []
    let undoIdx = -1
    let redoArray = []

    const addBgPicker = () => {
        bg.addEventListener('click', e => {
            bg.innerHTML = `<div class='bg-box'>
                                <input type='color' class='bg-picker' />
                            </div>`
            const bgPicker = document.querySelector('.bg-picker')
            bgPicker.addEventListener('input', e => {
                bgColor = bgPicker.value
                canvas.style.background = bgColor
                bg.innerHTML = 'background'
            })
        })
    }


    const changeColor = () => {
        Array.from(colors).forEach((color, i) => {
            color.addEventListener('click', e => {
                console.log("color " + i + " clicked")
                console.log(color.style.background)
                penColor = (i == 0 ? 'red' : (i == 1 ? 'blue' : (i == 2 ? 'green' : 'yellow')))
            })
        })
    }

    const changePickerColor = () => {
        picker.addEventListener('input', e => {
            penColor = picker.value
        })
    }

    const changeWidth = () => {
        range.addEventListener('input', e => {
            penWidth = range.value
        })
    }

    const clearPage = () => {
        clear.addEventListener('click', e => {
            ctx.fillStyle = bgColor
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        })
        
    }

    const undoCanvas = () => {
        undo.addEventListener('click', e => {
            console.log(undoIdx)
            if(undoIdx <= 0) {
                ctx.fillStyle = bgColor
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                undoArray = []
                undoIdx = -1
            }
            else {
                undoIdx -= 1
                undoArray.slice(undoIdx, 1)
                ctx.putImageData(undoArray[undoIdx], 0, 0)
            }
        })
    }

    const redoCanvas = () => {
        redo.addEventListener('click', e => {
            if(undoIdx + 1 < redoArray.length) {
                undoIdx += 1
                undoArray.push(redoArray[undoIdx])
                ctx.putImageData(redoArray[undoIdx], 0, 0)
            }
        })
    }

    const erasePage = () => {
        erase.addEventListener('click', e => {
            console.log('eraser clicked')
            penColor = bgColor
            canvas.classList.add('eraser')
            console.log(canvas.classList.item(0))
        })
    }




    changeColor()
    changePickerColor()
    changeWidth()
    clearPage()
    undoCanvas()
    redoCanvas()
    erasePage()
    addBgPicker()  

    const start = (e) => {
        flag = true
        ctx.beginPath()
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
    }
    
    const end = (e) => {
        if(flag) {
            ctx.closePath()
            flag = false
        }

        if(e.type != 'mouseout') {
            undoArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
            redoArray.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
            undoIdx += 1;
            console.log(undoArray)
        }

    }

    const draw = (e) => {
        if(!flag) return
        ctx.lineWidth = penWidth
        ctx.lineCap = 'round'
        ctx.strokeStyle = penColor
        ctx.lineJoin = 'round'

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
        ctx.stroke()

    }

    canvas.addEventListener('mousedown', start)
    canvas.addEventListener('mouseup', end)
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseout', end)

    window.addEventListener('resize', (e) => {
        canvas.height = 0.77 * window.innerHeight
        canvas.width = 0.8 * window.innerWidth
        ctx.putImageData(undoArray[undoIdx], 0, 0)
    })

})

